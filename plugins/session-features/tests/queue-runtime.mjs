// Use the same published Harness modules as the Desktop checkout or app.asar.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import sessionFeatures from '../index.js';

const require = createRequire(resolve(process.env.DSH_TEST_RUNTIME, 'package.json'));
const load = name => import(pathToFileURL(require.resolve(`@deepseek-ai/${name}`)).href);
const [{ Context, Service }, llm, sessions, projections, prompts, tools, native, agents, persistence, loop] = await Promise.all([
  load('cordis'), load('dsh-llm'), load('dsh-session'), load('dsh-session-projection'),
  load('dsh-system-prompt'), load('dsh-tools'), load('dsh-tool-executor-native'),
  load('dsh-agent'), load('dsh-session-persistence-jsonl'), load('dsh-agent-loop'),
]);
export const { createUserMessage } = llm;

export async function mount(root, enhanced = true) {
  const ctx = new Context();
  for (const plugin of [llm.default, sessions.default, projections.default, prompts.default, tools.default, native, agents.default]) await ctx.plugin(plugin);
  await ctx.plugin(persistence, { root });
  await ctx.plugin(loop.default, { agents: [] });
  const requests = [];
  let hang = true;
  class Adapter extends llm.LlmAdapter {
    resolveModel(provider, model) { return Promise.resolve({ provider, id: model, name: model }); }
    async *stream(options) {
      requests.push(options);
      if (hang) {
        yield { type: 'block-start', index: 0, blockType: 'text' };
        await new Promise((resolve, reject) => {
          if (options.signal.aborted) return reject(new Error('aborted'));
          options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
        });
      } else {
        yield { type: 'finish', reason: { kind: 'stop' } };
      }
    }
  }
  ctx.llm.registerAdapter(['queue-test'], new Adapter());
  // Minimal admission seam; all inbox mutations, logs, projections, lifecycle,
  // storage and replay below are the real published Harness implementations.
  const admissionContexts = [];
  class QueueAdmission extends Service {
    static inject = ['agents', 'queueCaller'];
    constructor(ctx) { super(ctx, 'sessionController'); }
    async prompt(request) {
      admissionContexts.push(this.ctx.queueCaller);
      this.ctx.agents.get(request.sessionId).followup(request.message);
      return { accepted: true };
    }
    async updateQueue(request) {
      const inbox = this.ctx.agents.get(request.sessionId).inbox;
      if (request.action === 'remove') inbox.remove(request.itemId);
      else inbox.replace(request.itemId, request.message);
      return { accepted: true };
    }
  }
  ctx.provide('queueCaller', 'base');
  await ctx.plugin(QueueAdmission);
  let plugin;
  if (enhanced) plugin = await ctx.plugin(sessionFeatures);
  return { ctx, requests, plugin, admissionContexts, complete: () => { hang = false; } };
}

export function message(text, extras = {}) {
  return createUserMessage({ content: [{ type: 'text', text }], source: { kind: 'user' }, ...extras });
}

export async function until(predicate) {
  const deadline = Date.now() + 5000;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error('runtime condition timed out');
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}

if (process.argv[2] === 'crash-child') {
  const { ctx, requests } = await mount(process.argv[3]);
  const { agent } = await ctx.agents.create({ sessionId: 'queue-crash', meta: { cwd: process.argv[3] }, agentOptions: { provider: 'queue-test', model: 'test' } });
  agent.followup(message('active'));
  await until(() => requests.length === 1);
  const queued = message('durable before crash');
  await ctx.get('sessionController').prompt({ sessionId: agent.id, message: queued });
  process.send({ queued });
  // The parent kills this process immediately after the acknowledgement.
  setInterval(() => {}, 1000);
}
