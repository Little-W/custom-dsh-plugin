import type { RunSnapshot } from '../../host/shared/types.js';
export interface CanvasStatusNode {
    id: string;
    kind: string;
    data?: Record<string, unknown>;
}
/**
 * 运行快照 → 节点状态映射（画布回显用）。
 * 传入画布节点时，把子图内部节点的状态聚合回折叠节点：running 优先，其次 fail，
 * 只有全部内部节点都产出后才显示 ok。这样折叠后的子图也能看到运行进度。
 */
export declare function runStatusMap(snapshot: RunSnapshot | null | undefined, nodes?: CanvasStatusNode[]): Record<string, {
    status: string;
    attempts: number;
    outputSummary: string;
}>;
/** 运行中节点 id 列表（「当前运行节点高亮」；画布高亮数据源，防回环只写视图）。 */
export declare function runningNodeIds(snapshot: RunSnapshot | null | undefined, nodes?: CanvasStatusNode[]): string[];
