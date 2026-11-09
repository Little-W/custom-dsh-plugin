// Native AgentModel owns routing, durable selections and model-switch notices.
// Only hosts without AgentModel use the legacy assembly/request waterfalls.
import { AsyncLocalStorage } from 'node:async_hooks';

/** An empty workflow setting means inherit; it must never become the route "/". */
export function normalizeModelSelection(value) {
    const provider = typeof value?.provider === 'string' ? value.provider.trim() : '';
    const model = typeof value?.model === 'string' ? value.model.trim() : '';
    if (!provider || !model)
        return undefined;
    const effort = typeof value.reasoningEffort === 'string' ? value.reasoningEffort.trim() : '';
    return { provider, model, ...(effort ? { reasoningEffort: effort } : {}) };
}

function nativeModelOf(agent) {
    return typeof agent?.model?.select === 'function' ? agent.model : undefined;
}

/** Compatibility only: modern hosts freeze routing BEFORE prompt/tool preparation. */
export function installModelSelectionLike(childCtx, selection) {
    const disposeAssembly = childCtx.on('system-prompt/assemble', async (_assembly, context, next) => {
        const assembly = await next();
        if (selection.nativeModel || context?.modelSelection)
            return assembly;
        const selected = normalizeModelSelection(selection.current);
        selection.assembled = selected;
        if (!selected || !assembly || typeof assembly !== 'object')
            return assembly;
        return { ...assembly, variables: { ...(assembly.variables ?? {}), provider: selected.provider, model: selected.model } };
    });
    const disposeRequest = childCtx.on('agent/request', async (payload, next) => {
        const resolved = await next();
        // Also guard late registration/recovery: never override a modern Agent's fixed step.
        if (selection.nativeModel || nativeModelOf(payload?.agent))
            return resolved;
        const selected = normalizeModelSelection(selection.assembled);
        if (!selected)
            return resolved;
        const withoutInherited = { ...resolved };
        delete withoutInherited.reasoningEffort;
        return { ...withoutInherited, ...selected };
    });
    return () => { disposeAssembly(); disposeRequest(); };
}

export function createModelSelectionSetup() {
    const selections = new WeakMap();
    const nativeModels = new WeakMap();
    const pending = new AsyncLocalStorage();
    const remembered = new Map();
    const parentRefs = new Map();
    const contribution = childCtx => {
        const selection = { current: normalizeModelSelection(pending.getStore()), assembled: undefined, nativeModel: nativeModels.get(childCtx) };
        selections.set(childCtx, selection);
        // Native model selection already supplies prompt variables and request routing.
        return selection.nativeModel ? () => {} : installModelSelectionLike(childCtx, selection);
    };
    const attach = (childCtx, value) => {
        const selected = normalizeModelSelection(value);
        const ref = selections.get(childCtx);
        if (!ref || !selected)
            return;
        ref.current = selected;
    };
    const remember = (childId, value) => {
        const selected = normalizeModelSelection(value);
        if (childId && selected)
            remembered.set(String(childId), selected);
    };
    const restore = (childId, childCtx) => {
        const selected = remembered.get(String(childId ?? ''));
        if (childCtx && typeof childCtx === 'object' && selected)
            attach(childCtx, selected);
    };
    // Called in agent/created, before the first step's selection is captured.
    const selectAgent = (agent, childId) => {
        const model = nativeModelOf(agent);
        if (model && agent.ctx && typeof agent.ctx === 'object') {
            nativeModels.set(agent.ctx, model);
            const ref = selections.get(agent.ctx);
            if (ref) ref.nativeModel = model;
        }
        const selected = normalizeModelSelection(pending.getStore() ?? remembered.get(String(childId ?? '')));
        if (selected) model?.select(selected);
    };
    const bindParent = (ctx, value, sessionId, onSelectionChange, agent) => {
        if (!ctx || typeof ctx !== 'object')
            return;
        const nativeModel = nativeModelOf(agent) ?? nativeModels.get(ctx);
        const selected = normalizeModelSelection(value);
        if (nativeModel && selected)
            nativeModel.select(selected);
        let ref = parentRefs.get(sessionId);
        // Reactivating a session creates a NEW Agent scope even in the same process.
        if (!ref || ref.ctx !== ctx) {
            ref?.dispose();
            ref = { ctx, current: selected, assembled: undefined, nativeModel, selectionSync: Promise.resolve() };
            parentRefs.set(sessionId, ref);
            const disposeRouting = nativeModel ? () => {} : installModelSelectionLike(ctx, ref);
            const disposeEvents = ctx.on('session/event', (_session, event) => {
                if (event?.type !== 'model/selection')
                    return;
                const next = normalizeModelSelection(event.data);
                if (!next)
                    return;
                ref.current = next;
                const sync = ref.onSelectionChange;
                ref.selectionSync = ref.selectionSync.then(() => sync?.({ ...next })).catch(() => {});
            });
            ref.dispose = () => { disposeRouting(); disposeEvents(); };
        }
        ref.nativeModel = nativeModel;
        ref.current = selected;
        ref.onSelectionChange = typeof onSelectionChange === 'function' ? onSelectionChange : undefined;
    };
    const copyOf = value => value ? { ...value } : null;
    return {
        contribution, attach, remember, restore, selectAgent, bindParent,
        withPending: (value, operation) => pending.run(normalizeModelSelection(value), operation),
        modelOf: childId => copyOf(remembered.get(String(childId ?? ''))),
        parentModelOf: sessionId => copyOf(parentRefs.get(String(sessionId ?? ''))?.current),
    };
}
