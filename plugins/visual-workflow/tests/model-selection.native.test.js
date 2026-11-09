import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createModelSelectionSetup } from '../lib/agent/model-selection.js';
import { RuntimeBase } from '../lib/orchestrator/runtime-base.js';

// The actual Desktop AgentLoop enforces the route/effort freeze that caused this failure.
// The scripted adapter never connects to a model provider or touches production sessions.
test('Desktop AgentLoop starts an inherited workflow, switches models, and restores its native selection', {
    skip: !process.env.DSH_WORKFLOW_TEST_ENTRY, timeout: 30000,
}, async t => {
    const entry = process.env.DSH_WORKFLOW_TEST_ENTRY;
    const resources = entry.slice(0, entry.indexOf('/app.asar/'));
    const { registerHostModuleFallback } = await import(pathToFileURL(resources + '/host-module-fallback.mjs').href);
    const hooks = registerHostModuleFallback(entry); t.after(() => hooks.deregister());
    const require = createRequire(entry);
    const load = name => import(pathToFileURL(require.resolve(name)).href);
    const { Context } = await load('@deepseek-ai/cordis');
    const { default: LlmRuntime, LlmAdapter, createUserMessage } = await load('@deepseek-ai/dsh-llm');
    const { default: Sessions, SessionId } = await load('@deepseek-ai/dsh-session');
    const ctx = new Context(); t.after(() => ctx.fiber.dispose());
    for (const name of ['@deepseek-ai/dsh-session-projection', '@deepseek-ai/dsh-system-prompt', '@deepseek-ai/dsh-tools', '@deepseek-ai/dsh-tool-executor-native', '@deepseek-ai/dsh-agent', '@deepseek-ai/dsh-agent-loop']) {
        // Core dependencies must precede their consumers.
        if (name === '@deepseek-ai/dsh-session-projection') { await ctx.plugin(LlmRuntime); await ctx.plugin(Sessions); }
        const plugin = await load(name); await ctx.plugin(plugin.default ?? plugin, name.endsWith('agent-loop') ? { agents: [] } : undefined);
    }
    const calls = [];
    class Adapter extends LlmAdapter {
        async resolveModel(provider, model) { return { provider, id: model, name: model, reasoning: { efforts: [{ id: 'high', name: 'High' }, { id: 'low', name: 'Low' }] } }; }
        async *stream(options) {
            calls.push(options);
            yield { type: 'block-start', index: 0, blockType: 'text' };
            yield { type: 'text-delta', index: 0, text: 'workflow started' };
            yield { type: 'block-end', index: 0, block: { type: 'text', text: 'workflow started' } };
            yield { type: 'finish', reason: { kind: 'stop' } };
        }
    }
    ctx.llm.registerAdapter(['opencode:openai'], new Adapter());
    const setup = createModelSelectionSetup();
    const runtime = Object.create(RuntimeBase.prototype), synced = [];
    runtime.deps = { promptSetup: { bindParent() {} }, modelSelection: setup, resolveRolePrompt: async () => '' };
    runtime.syncParentModelSelection = async (...args) => { synced.push(args); };
    const flow = { id: 'native-model-regression', nodes: [{ id: 'lead', kind: 'parent', data: { provider: '', model: '' } }] };
    const root = await ctx.agentLoop.create(SessionId('workflow-model-regression'), { provider: 'opencode:openai', model: 'gpt-6-luna', reasoningEffort: 'high' });
    await runtime.bindParentConfig(flow, root, root.id);
    async function run(agent) {
        const idle = new Promise(resolve => {
            const dispose = ctx.on('agent/status', ({ agent: current, status }) => { if (current === agent && status === 'idle') { dispose(); resolve(); } });
        });
        agent.followup(createUserMessage({ content: [{ type: 'text', text: 'Start this workflow.' }], source: { kind: 'user' } }));
        await idle;
        const end = agent.session.snapshotEvents().findLast(event => event.type === 'turn/end');
        assert.notEqual(end?.data.reason.kind, 'error', JSON.stringify(end?.data.reason));
    }
    await run(root); assert.equal(calls.length, 1);
    assert.equal(root.session.requestHeader().config.model, 'gpt-6-luna');
    assert.equal(root.session.requestHeader().config.reasoningEffort, 'high');
    root.model.select({ provider: 'opencode:openai', model: 'second-model' });
    await run(root); assert.equal(calls.length, 2);
    assert.equal(root.session.requestHeader().config.model, 'second-model');
    assert.equal(root.session.requestHeader().config.reasoningEffort, undefined);
    assert.ok(synced.some(args => args[3].model === 'second-model'));
    // Rebinding an inherited role reads the native request-header projection even
    // when no model-selection event is exposed to the workflow's legacy scanner.
    await runtime.bindParentConfig(flow, root, root.id);
    await run(root); assert.equal(calls.length, 3);
    assert.equal(root.session.requestHeader().config.model, 'second-model');
    // Node creation uses the same native path before the first child step.
    let child;
    const disposeCreated = ctx.on('agent/created', ({ agent }) => { if (agent.id === 'workflow-child-regression') { setup.selectAgent(agent, agent.id); setup.contribution(agent.ctx); } });
    await setup.withPending({ provider: 'opencode:openai', model: 'node-model', reasoningEffort: 'low' }, async () => {
        child = await ctx.agentLoop.create(SessionId('workflow-child-regression'), { provider: 'opencode:openai', model: 'inherited-parent', reasoningEffort: 'high' });
    });
    disposeCreated(); await run(child); assert.equal(calls.length, 4);
    assert.equal(child.session.requestHeader().config.model, 'node-model');
    assert.equal(child.session.requestHeader().config.reasoningEffort, 'low');
});
