import type { GraphNode, Line, SubgraphNode, WorkflowMode, WorkflowTemplate } from '../../host/shared/graph-model.js';
/** 子图内部图的最小形状。 */
export interface SubgraphGraphSnapshot {
    nodes: GraphNode[];
    lines: Line[];
}
/** 读取节点内部的子图结构（非子图/损坏数据返回 null）。 */
export declare function subgraphGraphOf(node: {
    kind?: string;
    data?: Record<string, unknown>;
} | null | undefined): SubgraphGraphSnapshot | null;
/** 子图是否为合法的最小完整图（恰一个 start，至少一个 end）。 */
export declare function subgraphCompleteness(graph: SubgraphGraphSnapshot | null): {
    starts: number;
    ends: number;
    ok: boolean;
};
/** 新子图的最小起止图（与 host 工厂保持相同语义；客户端不能 import host 运行时工厂）。 */
export declare function defaultSubgraphGraph(mode: WorkflowMode): SubgraphGraphSnapshot;
/**
 * 复制一个工作流模板的图作为子图内容。
 * 所有节点/连线 id 重新生成，并同步重写 groupId / memberIds / proxySourceId；
 * 模板中的阶段标签按目标模式归一，防止 mode2 的「输入/输出」进入 mode1。
 */
export declare function importSubgraphFromTemplate(template: WorkflowTemplate, mode: WorkflowMode): SubgraphGraphSnapshot;
/** 子图节点类型收窄（供组件使用）。 */
export declare function isSubgraphNode(node: {
    kind?: string;
} | null | undefined): node is SubgraphNode & {
    data: SubgraphNode['data'] & {
        graph: SubgraphGraphSnapshot;
    };
};
