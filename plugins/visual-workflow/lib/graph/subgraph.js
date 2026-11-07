// src/host/graph/subgraph.ts
//
// 子图展开（运行期唯一本体）。
//
// 用户语义：子图节点在主图中是一个可展开的完整工作流；运行前把它展开成主图节点，
// 让父代理看到并调度子图内部的 agent，而不是被一个不可执行的黑盒挡住。展开只发生
// 在运行快照/编排事实中，画布与落盘文档仍保持折叠形态。
//
// 展开规则：
//   - 子图内部 start 的出边 → 外部进入子图的边的目标；
//   - 子图内部 end 的入边 → 外部离开子图的边的来源；
//   - 子图内部节点 id 加 `<subgraph-node>__` 前缀，避免与主图/其他子图冲突；
//   - 只展开一层（内部子图由 validateFlow 拒绝）；条件边保留，外层条件优先。
//
// 这是纯函数：不读时钟/随机源、不改写入参。
import { isFlowLine } from './dag.js';
import { channelIn, channelOut } from './model.js';
const FLOW_OUT = channelOut('flow');
const FLOW_IN = channelIn('flow');
/** 子图内部节点 id 的展开前缀（稳定、可预测；客户端可用它映射运行状态）。 */
export function subgraphChildIdPrefix(subgraphId) {
    return `${subgraphId}__`;
}
/**
 * 把文档中的全部一层子图节点展开为普通节点/连线。
 * 没有子图时返回原文档的浅拷贝（保持调用方不可变性约定）。
 */
export function flattenSubgraphs(flow) {
    if (!flow.nodes.some((node) => node.kind === 'subgraph'))
        return flow;
    const nodes = [];
    const lines = [];
    for (const node of flow.nodes) {
        if (node.kind !== 'subgraph') {
            nodes.push(node);
            continue;
        }
        const graph = node.data.graph;
        const innerNodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
        const innerLines = Array.isArray(graph?.lines) ? graph.lines : [];
        const prefix = subgraphChildIdPrefix(node.id);
        const idMap = new Map(innerNodes.map((inner) => [inner.id, `${prefix}${inner.id}`]));
        const startIds = new Set(innerNodes.filter((inner) => inner.kind === 'start').map((inner) => inner.id));
        const endIds = new Set(innerNodes.filter((inner) => inner.kind === 'end').map((inner) => inner.id));
        // 内部节点：保留 data（角色配置、Team 成员等），只重写所有 id 引用。
        for (const inner of innerNodes) {
            // 内部 start/end 是子图接口标记：展开后由外部流程边直接连接内部 body，
            // 保留它们会让主图出现第二个 start（违反唯一入口）和孤立 end。
            if (inner.kind === 'subgraph' || inner.kind === 'start' || inner.kind === 'end')
                continue;
            const copy = structuredClone(inner);
            copy.id = idMap.get(inner.id) ?? inner.id;
            const data = copy.data;
            if (inner.kind === 'parent' || inner.kind === 'agent') {
                data.groupId = typeof data.groupId === 'string' ? (idMap.get(data.groupId) ?? data.groupId) : data.groupId;
            }
            if (inner.kind === 'group') {
                data.memberIds = (Array.isArray(data.memberIds) ? data.memberIds : [])
                    .map((id) => idMap.get(String(id)) ?? String(id));
            }
            if (inner.kind === 'proxy') {
                const proxy = copy;
                proxy.proxySourceId = idMap.get(proxy.proxySourceId ?? '') ?? proxy.proxySourceId;
            }
            // 子图节点不参与运行时展开：内部 body 保留为节点会让父代理误以为可调度；
            // 由 validateFlow 在保存前拒绝，这里防御性跳过。
            nodes.push(copy);
        }
        // 内部连线：start/end 的连接线只作为与外部主图的接口，不进入展开后的图。
        for (const inner of innerLines) {
            const source = idMap.get(inner.source);
            const target = idMap.get(inner.target);
            if (!source || !target || startIds.has(inner.source) || endIds.has(inner.target))
                continue;
            lines.push({ ...inner, id: `${prefix}${inner.id}`, source, target });
        }
        const incoming = flow.lines.filter((line) => line.target === node.id && isFlowLine(line));
        const outgoing = flow.lines.filter((line) => line.source === node.id && isFlowLine(line));
        const bodyIds = new Set(innerNodes.filter((inner) => inner.kind !== 'start' && inner.kind !== 'end' && inner.kind !== 'subgraph').map((inner) => inner.id));
        const startOut = innerLines.filter((line) => startIds.has(line.source) && isFlowLine(line) && bodyIds.has(line.target));
        const endIn = innerLines.filter((line) => endIds.has(line.target) && isFlowLine(line) && bodyIds.has(line.source));
        // 进入子图：外部前驱 → 子图 start 的所有下游；无内部下游时直接连到所有输出端。
        for (const incomingLine of incoming) {
            if (startOut.length === 0) {
                for (const outgoingLine of outgoing) {
                    lines.push({
                        ...incomingLine,
                        id: `${prefix}${incomingLine.id}__direct__${outgoingLine.id}`,
                        target: outgoingLine.target,
                        sourceHandle: FLOW_OUT,
                        targetHandle: FLOW_IN,
                        condition: incomingLine.condition ?? outgoingLine.condition,
                    });
                }
                continue;
            }
            for (const internal of startOut) {
                const target = idMap.get(internal.target);
                if (!target)
                    continue;
                lines.push({
                    ...incomingLine,
                    id: `${prefix}${incomingLine.id}__${internal.id}`,
                    target,
                    sourceHandle: FLOW_OUT,
                    targetHandle: FLOW_IN,
                    condition: incomingLine.condition ?? internal.condition,
                });
            }
        }
        // 离开子图：子图 end 的所有上游 → 外部后继。
        for (const outgoingLine of outgoing) {
            for (const internal of endIn) {
                const source = idMap.get(internal.source);
                if (!source)
                    continue;
                lines.push({
                    ...outgoingLine,
                    id: `${prefix}${internal.id}__${outgoingLine.id}`,
                    source,
                    sourceHandle: FLOW_OUT,
                    targetHandle: FLOW_IN,
                    condition: outgoingLine.condition ?? internal.condition,
                });
            }
        }
    }
    return { ...flow, nodes, lines };
}
//# sourceMappingURL=subgraph.js.map