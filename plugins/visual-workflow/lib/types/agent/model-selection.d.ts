/** A complete route; absent workflow settings inherit the native selection. */
export interface ModelSelectionLike {
    provider: string;
    model: string;
    reasoningEffort?: string;
}
export interface NativeAgentModelLike {
    select(selection: ModelSelectionLike): void;
    current?(): ModelSelectionLike | undefined;
}
export interface SelectionAgentLike {
    ctx?: object;
    model?: NativeAgentModelLike;
}
/** Legacy-host snapshot; modern hosts route exclusively through AgentModel. */
export interface ModelSelectionRefLike {
    current: ModelSelectionLike | undefined;
    assembled: ModelSelectionLike | undefined;
    nativeModel?: NativeAgentModelLike;
}
export interface SelectionChildContext {
    on(name: string, listener: (...args: any[]) => unknown): () => void;
}
/** Reject incomplete routes and normalize optional effort without inventing defaults. */
export declare function normalizeModelSelection(value: unknown): ModelSelectionLike | undefined;
/** Legacy compatibility; defers to native selection whenever that API is available. */
export declare function installModelSelectionLike(childCtx: SelectionChildContext, selection: ModelSelectionRefLike): () => void;
export interface ModelSelectionSetup {
    contribution(childCtx: SelectionChildContext): () => void;
    attach(childCtx: SelectionChildContext, selection: ModelSelectionLike): void;
    withPending<T>(selection: ModelSelectionLike | undefined, operation: () => Promise<T>): Promise<T>;
    remember(childId: string, selection: ModelSelectionLike): void;
    restore(childId: string, childCtx: unknown): void;
    /** agent/created: select before the first step is prepared, including cold restore. */
    selectAgent(agent: SelectionAgentLike, childId: string): void;
    /** Pass the live parent Agent to use its durable native selection API. */
    bindParent(ctx: unknown, selection: ModelSelectionLike | undefined, sessionId: string, onSelectionChange?: (selection: ModelSelectionLike) => void | Promise<void>, agent?: SelectionAgentLike): void;
    modelOf(childId: string): ModelSelectionLike | null;
    parentModelOf(sessionId: string): ModelSelectionLike | null;
}
export declare function createModelSelectionSetup(): ModelSelectionSetup;
