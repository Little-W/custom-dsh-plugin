import assert from 'node:assert/strict';
import test from 'node:test';
import { createModelSelectionSetup, installModelSelectionLike, normalizeModelSelection } from '../lib/agent/model-selection.js';
import { RuntimeBase } from '../lib/orchestrator/runtime-base.js';

class Scope {
    listeners = new Map();
    on(name, listener) { const list = this.listeners.get(name) ?? new Set(); list.add(listener); this.listeners.set(name, list); return () => list.delete(listener); }
    async waterfall(name, args, seed) { let next = async () => seed; for (const listener of [...(this.listeners.get(name) ?? [])].reverse()) { const tail = next; next = () => listener(...args, tail); } return next(); }
    emit(name, ...args) { for (const listener of this.listeners.get(name) ?? []) listener(...args); }
    count(name) { return this.listeners.get(name)?.size ?? 0; }
}
const chosen = { provider: 'opencode:openai', model: 'gpt-6-luna', reasoningEffort: 'high' };
function nativeAgent(ctx = new Scope()) {
    let current = chosen; const calls = [];
    return { id: 'root', ctx, calls, session: { events: [] }, model: {
        current: () => current && { ...current },
        select(value) { calls.push(value); current = { ...value }; ctx.emit('session/event', null, { type: 'model/selection', data: value }); },
    } };
}
function runtime(setup) {
    const syncs = [], instance = Object.create(RuntimeBase.prototype);
    instance.deps = { promptSetup: { bindParent() {} }, modelSelection: setup, resolveRolePrompt: async () => '', logger: { warn(message) { throw new Error(message); } } };
    instance.syncParentModelSelection = async (...args) => { syncs.push(args); }; return { instance, syncs };
}
const flow = data => ({ id: 'flow', nodes: [{ id: 'lead', kind: 'parent', data }] });
const request = Object.freeze({ ...chosen, maxTokens: 1000 });

test('empty/partial settings inherit; valid selections are detached and trimmed', () => {
    for (const value of [undefined, {}, { provider: '', model: '' }, { provider: 'x', model: ' ' }, { model: 'x' }]) assert.equal(normalizeModelSelection(value), undefined);
    assert.deepEqual(normalizeModelSelection({ provider: ' x ', model: ' y ', reasoningEffort: ' ' }), { provider: 'x', model: 'y' });
});
test('legacy empty parent cannot overwrite an inherited route with / or clear effort', async () => {
    const ctx = new Scope(), setup = createModelSelectionSetup(); setup.bindParent(ctx, { provider: '', model: '' }, 's');
    const assembly = { variables: { provider: chosen.provider, model: chosen.model } };
    assert.equal(await ctx.waterfall('system-prompt/assemble', [{}, {}], assembly), assembly);
    assert.equal(await ctx.waterfall('agent/request', [{}], request), request);
});
test('modern parent uses AgentModel without prompt/request routing overrides', async () => {
    const root = nativeAgent(), setup = createModelSelectionSetup(); setup.bindParent(root.ctx, chosen, 's', undefined, root);
    assert.deepEqual(root.calls, [chosen]); assert.equal(root.ctx.count('agent/request'), 0); assert.equal(root.ctx.count('system-prompt/assemble'), 0);
    assert.equal(await root.ctx.waterfall('agent/request', [{ agent: root }], request), request);
});
test('runtime restores native selection with no model event in the last 200 records', async () => {
    const root = nativeAgent(); root.session.events = Array.from({ length: 500 }, () => ({ type: 'assistant/message' }));
    const setup = createModelSelectionSetup(), { instance, syncs } = runtime(setup);
    await instance.bindParentConfig(flow({ provider: '', model: '', reasoning: 'low' }), root, 's');
    assert.deepEqual(root.calls, [chosen]); assert.deepEqual(setup.parentModelOf('s'), chosen); assert.deepEqual(syncs[0], ['flow', 's', 'lead', chosen]);
    assert.equal(await root.ctx.waterfall('agent/request', [{ agent: root }], request), request);
});
test('configured route is selected natively when the session has no prior selection', async () => {
    const root = nativeAgent(); root.model.current = () => undefined;
    const { instance } = runtime(createModelSelectionSetup());
    await instance.bindParentConfig(flow({ provider: chosen.provider, model: chosen.model, reasoning: 'high' }), root, 's'); assert.deepEqual(root.calls, [chosen]);
});
test('empty configuration and no prior selection leave native defaults untouched', async () => {
    const root = nativeAgent(); root.model.current = () => undefined; const { instance } = runtime(createModelSelectionSetup());
    await instance.bindParentConfig(flow({}), root, 's'); assert.deepEqual(root.calls, []);
    assert.equal(await root.ctx.waterfall('agent/request', [{ agent: root }], request), request);
});
test('session-bar changes sync the instance without rewriting the frozen current request', async () => {
    const root = nativeAgent(), setup = createModelSelectionSetup(), updates = [];
    setup.bindParent(root.ctx, chosen, 's', value => updates.push(value), root);
    const changed = { provider: 'other', model: 'new' }; root.model.select(changed); await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(updates, [changed]); assert.deepEqual(setup.parentModelOf('s'), changed);
    assert.equal(await root.ctx.waterfall('agent/request', [{ agent: root }], request), request); assert.deepEqual(root.model.current(), changed);
});
test('reactivating the same session binds a new scope and removes stale listeners', async () => {
    const setup = createModelSelectionSetup(), before = nativeAgent(), after = nativeAgent(), changes = [];
    setup.bindParent(before.ctx, chosen, 's', () => { throw new Error('stale listener'); }, before);
    setup.bindParent(after.ctx, chosen, 's', selected => changes.push(selected), after);
    assert.equal(before.ctx.count('session/event'), 0); assert.equal(after.ctx.count('session/event'), 1);
    after.model.select({ ...chosen, reasoningEffort: 'low' }); await new Promise(resolve => setImmediate(resolve)); assert.equal(changes.length, 1);
});
test('child creation and cold recovery select natively before their first request', async () => {
    const setup = createModelSelectionSetup(), child = nativeAgent();
    await setup.withPending(chosen, async () => { setup.selectAgent(child, 'child'); setup.contribution(child.ctx); });
    assert.deepEqual(child.calls, [chosen]); assert.equal(child.ctx.count('agent/request'), 0); setup.remember('child', chosen);
    const restored = nativeAgent(); setup.selectAgent(restored, 'child'); setup.contribution(restored.ctx); setup.restore('child', restored.ctx);
    assert.deepEqual(restored.model.current(), chosen); assert.equal(restored.ctx.count('agent/request'), 0);
    assert.equal(await restored.ctx.waterfall('agent/request', [{ agent: restored }], request), request); assert.deepEqual(setup.modelOf('child'), chosen);
});
test('legacy hooks defer when a request reveals a native AgentModel', async () => {
    const root = nativeAgent(), ref = { current: { provider: 'stale', model: 'old' } }; installModelSelectionLike(root.ctx, ref);
    await root.ctx.waterfall('system-prompt/assemble', [{}, {}], {});
    assert.equal(await root.ctx.waterfall('agent/request', [{ agent: root }], request), request);
});
test('legacy hosts retain the assembly snapshot and default-effort compatibility', async () => {
    const ctx = new Scope(), selection = { current: { provider: 'p', model: 'm' } }; const dispose = installModelSelectionLike(ctx, selection);
    await ctx.waterfall('system-prompt/assemble', [{}, {}], {}); selection.current = { provider: 'changed', model: 'next', reasoningEffort: 'low' };
    assert.deepEqual(await ctx.waterfall('agent/request', [{}], request), { provider: 'p', model: 'm', maxTokens: 1000 }); dispose(); assert.equal(ctx.count('agent/request'), 0);
});
