// src/host/tools/wf-wait-agent/tool.ts
//
// wf_wait_agent 工具注册：等待任意工作流节点（普通子代理或 Team 成员）结算。
//
// 为什么需要它：官方 wait_agent 只观察官方 Team 成员；普通 agent 节点
// （stage-spec / stage-system-dv / stage-synthesis 等）不在 Team roster 内，
// 官方 wait_agent 必然返回 no-active-peer。父代理若想阻塞等待这些普通节点，
// 只能退化成 bash 轮询；本工具以运行快照为事实源补上可观察等待。
//
// 职责边界：只做「注册 + 身份派生」，等待语义全部收敛在编排运行时；
// 不启动、不重派节点；仅父代理可见（子代理侧经 CHILD_AGENT_HIDDEN_TOOLS 隐藏）。
import { WF_WAIT_AGENT } from '../../shared/protocol.js';
import { callerOf } from '../infrastructure/caller.js';
import { defineTool } from '../infrastructure/define-tool.js';
import { registerTool, requireToolsService } from '../infrastructure/register-tool.js';
import { textRender } from '../infrastructure/text-render.js';
/** 注册 wf_wait_agent（全局层；ctx.tools.register）。 */
export function registerWfWaitAgent(ctx, host) {
    const tools = requireToolsService(ctx, WF_WAIT_AGENT);
    const definition = defineTool({
        name: WF_WAIT_AGENT,
        description: 'Wait until an already-started workflow node settles (ordinary child agent or Team member). ' +
            'Use this instead of the official wait_agent when waiting for a non-Team child: wait_agent only observes official Team members and returns no-active-peer for ordinary nodes. ' +
            'This tool never starts or re-dispatches a node; it polls the run snapshot and returns the node status, run status, output summary and elapsed time. ' +
            'Returns status="timeout" when the timeout expires; runStatus reports paused/stopped/interrupted runs immediately.',
        parameters: {
            nodeId: { type: 'string', required: true, description: 'Node id from the flow definition file (nodes[].id). A proxy node is resolved to its source node.' },
            timeoutMs: { type: 'number', description: 'Maximum wait in milliseconds; default 300000, allowed 1000..3600000.' },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    nodeId: { type: 'string', required: true, description: 'The resolved node id that was waited on.' },
                    status: { type: 'string', required: true, description: 'Node status, or timeout when the deadline expires.' },
                    runStatus: { type: 'string', description: 'Run status observed at return time.' },
                    output: { type: 'string', description: 'Final node output summary when the node settled successfully.' },
                    attempts: { type: 'number', description: 'Attempt count recorded in the run snapshot.' },
                    childId: { type: 'string', description: 'The child session id currently bound to the node.' },
                    waitedMs: { type: 'number', required: true, description: 'Elapsed wait in milliseconds.' },
                },
            },
            render: textRender,
        },
        execute: (args, exec) => host.orchestrator.wfWaitAgent(callerOf(exec), args ?? {}, exec.signal),
    });
    return registerTool(tools, definition);
}
//# sourceMappingURL=tool.js.map