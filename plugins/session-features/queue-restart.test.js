import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fork } from 'node:child_process';
import { once } from 'node:events';

// DSH_TEST_RUNTIME points to the Desktop checkout (or packaged app.asar).
const enabled = !!process.env.DSH_TEST_RUNTIME;
const runtime = enabled ? await import('./tests/queue-runtime.mjs') : null;

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-plugin-queue-'));
  const contexts = [];
  t.after(async () => {
    for (const ctx of contexts.reverse()) await ctx.fiber.dispose();
    await rm(root, { recursive: true, force: true });
  });
  return { root, async mount(enhanced = true) {
    const result = await runtime.mount(root, enhanced);
    contexts.push(result.ctx);
    return result;
  } };
}

test('native teardown reproduces the lost-queue bug without the plugin', { skip: !enabled }, async t => {
  const f = await fixture(t);
  const { ctx } = await f.mount(false);
  const { agent, dispose } = await ctx.agents.create({ sessionId: 'native-baseline', meta: { cwd: f.root } });
  agent.send(runtime.message('queued'), 'next-turn', false);
  await ctx.sessions.flush(agent.session);
  await dispose();
  const resumed = await ctx.agents.resume({ resumeSessionId: agent.id });
  assert.equal(resumed.agent.inbox.nextTurn.length, 0);
});

test('restart preserves FIFO, edits, attachments and steering while excluding removed messages', { skip: !enabled }, async t => {
  const f = await fixture(t);
  const first = await f.mount();
  const { agent } = await first.ctx.agents.create({ sessionId: 'queue-restart', meta: { cwd: f.root }, agentOptions: { provider: 'queue-test', model: 'test' } });
  agent.followup(runtime.message('active'));
  await runtime.until(() => first.requests.length === 1);
  const one = runtime.message('one');
  const two = runtime.message('two');
  const removed = runtime.message('remove me');
  const edit = { ...two, content: [{ type: 'text', text: 'edited two' }, { type: 'image', source: { type: 'base64', mediaType: 'image/png', data: 'AA==' } }] };
  for (const msg of [one, two, removed]) await first.ctx.get('sessionController').prompt({ sessionId: agent.id, message: msg });
  await first.ctx.get('sessionController').updateQueue({ sessionId: agent.id, itemId: two.id, action: 'edit', message: edit });
  await first.ctx.get('sessionController').updateQueue({ sessionId: agent.id, itemId: removed.id, action: 'remove' });
  const steering = runtime.message('steering');
  agent.send(steering, 'next-step', false);
  assert.deepEqual(first.admissionContexts, ['base', 'base', 'base']);
  // Remote calls trace the same Service through a caller-specific Context.
  // The wrapper must not replace that Context with the plugin's own Context.
  const caller = first.ctx.extend({ queueCaller: 'remote-caller' });
  const extra = runtime.message('temporary caller-context check');
  await caller.get('sessionController').prompt({ sessionId: agent.id, message: extra });
  assert.equal(first.admissionContexts.at(-1), 'remote-caller');
  await caller.get('sessionController').updateQueue({ sessionId: agent.id, itemId: extra.id, action: 'remove' });
  await first.plugin.dispose();
  const rawController = first.ctx.get('sessionController')[Symbol.for('cordis.original')];
  assert.equal(Object.hasOwn(rawController, 'prompt'), false);
  assert.equal(Object.hasOwn(rawController, 'updateQueue'), false);
  // Close the whole runtime, including plugin unload before agent teardown.
  await first.ctx.fiber.dispose();
  const second = await f.mount();
  const resumed = await second.ctx.agents.resume({ resumeSessionId: agent.id });
  assert.deepEqual(resumed.agent.inbox.nextTurn, [one, edit]);
  assert.deepEqual(resumed.agent.inbox.nextStep, [steering]);
  assert.equal(resumed.agent.status, 'idle');
  assert.equal(second.requests.length, 0);
  // Native claim is the only consumer; completing all queued turns must not
  // replay the original active message or resurrect the removed entry.
  second.complete();
  resumed.agent.send(runtime.message('continue', { source: { kind: 'studio-continuation', form: 'resume-signal' }, content: [] }), 'next-turn', true);
  await resumed.agent.whenIdle();
  assert.equal(resumed.agent.inbox.nextTurn.length, 0);
  await second.ctx.fiber.dispose();
  const third = await f.mount();
  const again = await third.ctx.agents.resume({ resumeSessionId: agent.id });
  assert.equal(again.agent.inbox.nextTurn.length, 0);
  assert.equal(again.agent.inbox.nextStep.length, 0);
});

test('SIGKILL immediately after queue acknowledgement survives a fresh process', { skip: !enabled, timeout: 15000 }, async t => {
  const f = await fixture(t);
  const child = fork(new URL('./tests/queue-runtime.mjs', import.meta.url), ['crash-child', f.root], { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  t.after(() => child.kill('SIGKILL'));
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  const reply = await Promise.race([
    once(child, 'message').then(([value]) => value),
    once(child, 'exit').then(([code]) => { throw new Error(`child exited ${code}: ${stderr}`); }),
  ]);
  const exit = once(child, 'exit');
  child.kill('SIGKILL');
  await exit;
  const { ctx, requests } = await f.mount();
  const { agent } = await ctx.agents.resume({ resumeSessionId: 'queue-crash' });
  assert.deepEqual(agent.inbox.nextTurn, [reply.queued]);
  assert.equal(agent.status, 'idle');
  assert.equal(requests.length, 0);
});
