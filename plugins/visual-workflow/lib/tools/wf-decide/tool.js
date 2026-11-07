// src/host/tools/wf-decide/tool.ts
//
// wf_decide 工具注册（条件分支决策记录：把「按证据选路」落成可审计的运行事实）。
//
// 职责边界：
//   - 本文件只做「注册（defineTool DSL）+ 身份派生（callerOf）+ 归属校验」，
//     分支边校验、证据要求与快照写入全部收敛在编排运行时（host.orchestrator.wfDecide）；
//   - 工具可见性：仅父代理可见（分支决策是编排职责，子代理侧经白名单剔除 +
//     tools.restrict 双保险隐藏，本层再以 callerOf 归属校验兜底 WF_NOT_ROOT）。
//
// 提示词规范：description 使用官方标准英文，第一句写明「何时调用」，
// 随后是前置条件/失败语义（WF_* 稳定错误码）/副作用（写入运行快照）。
import { WF_DECIDE } from '../../shared/protocol.js';
import { callerOf } from '../infrastructure/caller.js';
import { defineTool } from '../infrastructure/define-tool.js';
import { registerTool, requireToolsService } from '../infrastructure/register-tool.js';
import { textRender } from '../infrastructure/text-render.js';
/**
 * 注册 wf_decide（全局层；ctx.tools.register）。
 * 返回 disposer：注销失败尽力而为。
 */
export function registerWfDecide(ctx, host) {
    const tools = requireToolsService(ctx, WF_DECIDE);
    const definition = defineTool({
        name: WF_DECIDE,
        description: 'Record which conditional branch you chose before dispatching its target, with real evidence. ' +
            'Required at branch points (a node with two or more conditional flow-out edges) when the decision gate is enabled; otherwise the target dispatch is rejected with WF_DECISION_REQUIRED. ' +
            'Only the session main agent may call it. A decision only covers the branch source\'s latest turn: after that source settles a new turn, decide again. ' +
            'Rejected with WF_DECISION_BAD_TARGET when no conditional pass/fail/content edge exists between the two nodes.',
        parameters: {
            sourceNodeId: { type: 'string', required: true, description: 'Canvas node id of the branch source (the node that produced evidence and owns the outgoing conditional edges).' },
            targetNodeId: { type: 'string', required: true, description: 'Canvas node id of the branch target you are about to dispatch.' },
            evidence: { type: 'string', required: true, description: 'Real evidence for the choice: file paths, commands, logs, exit codes, report sections. Chat-level claims are not accepted.' },
            rationale: { type: 'string', description: 'Optional short conclusion: why this branch and not the others.' },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    decisionId: { type: 'string', required: true, description: 'Recorded decision id.' },
                    runId: { type: 'string', required: true, description: 'Run snapshot id the decision was written to.' },
                    sourceNodeId: { type: 'string', required: true, description: 'Branch source node id.' },
                    targetNodeId: { type: 'string', required: true, description: 'Branch target node id.' },
                    lineId: { type: 'string', required: true, description: 'Matched conditional flow line id.' },
                    conditionType: { type: 'string', required: true, enum: ['pass', 'fail', 'content'], description: 'Matched condition type.' },
                    label: { type: 'string', description: 'Matched condition label.' },
                    at: { type: 'string', required: true, description: 'Decision timestamp (ISO).' },
                },
            },
            render: textRender,
        },
        execute: (args, exec) => host.orchestrator.wfDecide(callerOf(exec), args ?? {}),
    });
    return registerTool(tools, definition);
}
//# sourceMappingURL=tool.js.map