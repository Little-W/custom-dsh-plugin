// src/host/tools/wf-resume/tool.ts
//
// wf_resume 工具注册（编排续跑：人工决策后继续暂停/停止/中断的运行，可选回滚）。
//
// 职责边界：
//   - 本文件只做「注册（defineTool DSL）+ 身份派生（callerOf）+ 归属校验」，
//     续跑/回滚/锁语义全部收敛在编排运行时（host.orchestrator.wfResume）；
//   - 工具可见性：仅父代理可见（子代理侧经白名单剔除 + tools.restrict 双保险隐藏，
//     本层再以 callerOf 归属校验兜底 WF_NOT_ROOT）。
//
// 提示词规范：description 使用官方标准英文，第一句写明「何时调用」，
// 随后是前置条件/失败语义（WF_* 稳定错误码）/副作用（续跑接管）。
import { WF_RESUME } from '../../shared/protocol.js';
import { callerOf } from '../infrastructure/caller.js';
import { defineTool } from '../infrastructure/define-tool.js';
import { registerTool, requireToolsService } from '../infrastructure/register-tool.js';
import { textRender } from '../infrastructure/text-render.js';
/**
 * 注册 wf_resume（全局层；ctx.tools.register）。
 * 返回 disposer：注销失败尽力而为。
 */
export function registerWfResume(ctx, host) {
    const tools = requireToolsService(ctx, WF_RESUME);
    const definition = defineTool({
        name: WF_RESUME,
        description: 'Resume a paused, stopped, or interrupted orchestration run after a human decision, and return the new run id immediately. ' +
            'Only the session main agent may call it; a run that is already running is rejected with WF_ALREADY_RUNNING. ' +
            'Pass rollbackToNodeId to invalidate that node and its flow downstream, then re-run from it; other completed branches stay inherited. ' +
            'After a successful resume, continue scheduling the resumed run from resumeFromNodeId (usually the rollback target).',
        parameters: {
            rollbackToNodeId: { type: 'string', description: 'Optional canvas node id (agent/parent; a proxy resolves to its source) to roll back to. Its downstream flow is reset to pending and re-run.' },
            reason: { type: 'string', description: 'Optional rollback/continue reason recorded in the new run snapshot for audit.' },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    runId: { type: 'string', required: true, description: 'The new resumed run id.' },
                    status: { type: 'string', required: true, enum: ['running'], description: 'The resumed run is running (continue scheduling its nodes).' },
                    resumedFromRunId: { type: 'string', required: true, description: 'The checkpoint run id that was resumed.' },
                    rollbackToNodeId: { type: 'string', description: 'The rollback target node id (present when rollback was requested).' },
                    invalidatedNodeIds: {
                        type: 'array',
                        description: 'Node ids whose previous output was discarded and reset to pending (target + flow downstream).',
                        items: { type: 'string' },
                    },
                },
            },
            render: textRender,
        },
        execute: (args, exec) => host.orchestrator.wfResume(callerOf(exec), args ?? {}),
    });
    return registerTool(tools, definition);
}
//# sourceMappingURL=tool.js.map