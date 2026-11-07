import { type WfToolsHost } from '../infrastructure/caller.js';
/** 注册 wf_wait_agent（全局层；ctx.tools.register）。 */
export declare function registerWfWaitAgent(ctx: {
    get(name: string): unknown;
}, host: WfToolsHost): () => void;
