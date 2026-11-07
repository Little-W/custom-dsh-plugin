import type { WorkflowDocument } from '../shared/graph-model.js';
/** 子图内部节点 id 的展开前缀（稳定、可预测；客户端可用它映射运行状态）。 */
export declare function subgraphChildIdPrefix(subgraphId: string): string;
/**
 * 把文档中的全部一层子图节点展开为普通节点/连线。
 * 没有子图时返回原文档的浅拷贝（保持调用方不可变性约定）。
 */
export declare function flattenSubgraphs(flow: WorkflowDocument): WorkflowDocument;
