import type { RoutePoint } from './orthogonal-routing.js';
export interface SegmentDrag {
    waypoints: RoutePoint[];
    index: number;
    axis: 'x' | 'y';
}
/** Interior straight sections translate along their normal, leaving terminal anchors attached. */
export declare function edgeSegmentDrag(points: RoutePoint[], index: number): SegmentDrag | null;
export declare function translateEdgeSegment(drag: SegmentDrag, delta: RoutePoint): RoutePoint[];
