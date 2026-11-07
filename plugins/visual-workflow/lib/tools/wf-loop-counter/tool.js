// src/host/tools/wf-loop-counter/tool.ts
//
// 通过性校验子代理的内部循环计数器。只读/写当前 run 的内存计数，不触碰磁盘；
// 由校验角色节点按 loopLimit 自动获得（见 runner.resolveAgentTools），普通子代理不可见。
import { WF_LOOP_COUNTER } from '../../shared/protocol.js';
import { callerOf } from '../infrastructure/caller.js';
import { defineTool } from '../infrastructure/define-tool.js';
import { registerTool, requireToolsService } from '../infrastructure/register-tool.js';
import { textRender } from '../infrastructure/text-render.js';
export function registerWfLoopCounter(ctx, host) {
    const tools = requireToolsService(ctx, WF_LOOP_COUNTER);
    const definition = defineTool({
        name: WF_LOOP_COUNTER,
        description: 'Internal loop counter for a pass/fail validation gate. Call action=tick when the gate evaluates a failed attempt; it returns the current count and exceeded=true when count > limit. ' +
            'On exceed the counter is reset automatically and the gate must stop looping and report BLOCKED/ESCALATE. Call action=reset when the gate passes or re-enters the loop.',
        parameters: {
            guardId: { type: 'string', required: true, description: 'Stable gate/loop id (use the gate node id).' },
            action: { type: 'string', enum: ['tick', 'reset'], description: 'tick increments; reset clears the counter. Default tick.' },
            limit: { type: 'number', description: 'Maximum failed attempts before escalation; default 4.' },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    guardId: { type: 'string', required: true },
                    action: { type: 'string', required: true },
                    count: { type: 'number', required: true },
                    limit: { type: 'number', required: true },
                    exceeded: { type: 'boolean', required: true },
                    reset: { type: 'boolean', required: true },
                },
            },
            render: textRender,
        },
        execute: (args, exec) => host.orchestrator.wfLoopCounter(callerOf(exec), args ?? {}),
    });
    return registerTool(tools, definition);
}
//# sourceMappingURL=tool.js.map