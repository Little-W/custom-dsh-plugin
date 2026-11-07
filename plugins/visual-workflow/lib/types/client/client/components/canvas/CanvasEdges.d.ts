import type { Dict } from '../../i18n.js';
import type { CanvasEdge, CanvasNode } from '../../studio/studio-state.js';
import { type MemberGroupIndex } from './geometry.js';
import type { OrthogonalRoute } from '../../lib/orthogonal-routing.js';
import type { RoutePoint } from '../../lib/orthogonal-routing.js';
/** 连线层：base = 卡片下方的常规连线；overlay = 抬到 Team 卡片之上的成员入线内段。 */
export type CanvasEdgeLayer = 'base' | 'overlay';
export interface CanvasEdgesProps {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
    byId: Map<string, CanvasNode>;
    /** 成员 → 组 预建索引（所属组反查 O(1)，由 GraphCanvas 按节点集 memo 化）。 */
    memberGroups: MemberGroupIndex;
    selectedEdge: string | null;
    selectedNode: string | null;
    routes: Map<string, OrthogonalRoute>;
    /** Present only while the displayed document is running; an empty set means no step is working. */
    activeNodeIds?: ReadonlySet<string>;
    isLockedEdge(id: string): boolean;
    copy: Dict;
    onEdgeSelect(id: string): void;
    onEdgePointerDown?(event: React.PointerEvent, id: string, waypointIndex?: number, segmentIndex?: number, curveAnchors?: RoutePoint[]): void;
    onAnchorRemove?(id: string, index: number, anchors: RoutePoint[]): void;
    onAnchorContext?(event: React.MouseEvent, id: string, index: number, anchors: RoutePoint[]): void;
    /** 连线草稿路径（拖拽连线中）。 */
    draftPath: string | null;
    /** 渲染层（缺省 base）；overlay 只画成员入线进入卡片后的短段。 */
    layer?: CanvasEdgeLayer;
}
export declare const CanvasEdges: import("react").MemoExoticComponent<(props: CanvasEdgesProps) => import("react").JSX.Element>;
