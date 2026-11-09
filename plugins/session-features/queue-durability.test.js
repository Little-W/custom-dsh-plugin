import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preserveInboxOnDispose, wrapDurableQueueCommand } from './queue-durability.js';

test('disposal preserves the inbox even when native teardown explicitly clears it', () => {
  const calls = [];
  const agent = { cancel(...args) { calls.push({ receiver: this, args }); return 'canceled'; } };
  preserveInboxOnDispose(agent);
  const wrapped = agent.cancel;
  preserveInboxOnDispose(agent);
  assert.equal(agent.cancel, wrapped);
  const options = { keepInbox: false, other: 'preserved' };
  assert.equal(agent.cancel({ kind: 'disposed' }, options), 'canceled');
  assert.equal(calls[0].receiver, agent);
  assert.deepEqual(calls[0].args, [{ kind: 'disposed' }, { keepInbox: true, other: 'preserved' }]);
  assert.equal(options.keepInbox, false);
});

test('explicit user and parent cancellation retain their original semantics', () => {
  const calls = [];
  const agent = { cancel(...args) { calls.push(args); } };
  preserveInboxOnDispose(agent);
  agent.cancel({ kind: 'user' });
  agent.cancel({ kind: 'parent' }, { keepInbox: false });
  agent.cancel({ kind: 'user' }, { keepInbox: true });
  assert.deepEqual(calls, [
    [{ kind: 'user' }, undefined],
    [{ kind: 'parent' }, { keepInbox: false }],
    [{ kind: 'user' }, { keepInbox: true }],
  ]);
});

for (const method of ['prompt', 'updateQueue']) {
  test(`${method} acknowledges only after persistence, preserving receiver and arguments`, async () => {
    const barrier = Promise.withResolvers();
    const request = { sessionId: 's' }, signal = new AbortController().signal;
    const controller = { [method](...args) { assert.equal(this, controller); assert.deepEqual(args, [request, signal]); return { accepted: true, seq: 12 }; } };
    const original = controller[method];
    const undo = wrapDurableQueueCommand(controller, method, async id => { assert.equal(id, 's'); await barrier.promise; });
    let acknowledged = false;
    const work = controller[method](request, signal).then(result => { acknowledged = true; return result; });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(acknowledged, false);
    barrier.resolve();
    assert.deepEqual(await work, { accepted: true, seq: 12 });
    undo();
    assert.equal(controller[method], original);
  });
}

test('failed storage never produces a success acknowledgement', async () => {
  const controller = { async prompt() { return { accepted: true }; } };
  wrapDurableQueueCommand(controller, 'prompt', async () => { throw new Error('disk full'); });
  await assert.rejects(controller.prompt({ sessionId: 's' }), /disk full/);
});

test('rejected admissions are not flushed and cleanup does not overwrite another wrapper', async () => {
  let flushed = false;
  const controller = { async prompt() { throw new Error('denied'); } };
  const undo = wrapDurableQueueCommand(controller, 'prompt', async () => { flushed = true; });
  await assert.rejects(controller.prompt({ sessionId: 's' }), /denied/);
  assert.equal(flushed, false);
  const replacement = controller.prompt.bind(controller);
  controller.prompt = replacement;
  undo();
  assert.equal(controller.prompt, replacement);
});
