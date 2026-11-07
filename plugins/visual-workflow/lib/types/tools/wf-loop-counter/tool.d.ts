import { type WfToolsHost } from '../infrastructure/caller.js';
export declare function registerWfLoopCounter(ctx: {
    get(name: string): unknown;
}, host: WfToolsHost): () => void;
