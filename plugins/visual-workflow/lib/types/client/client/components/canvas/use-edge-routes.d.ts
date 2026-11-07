import type { CanvasEdge, CanvasNode } from '../../lib/canvas-model.js';
import type { LineLabelCopy } from '../../lib/graph-edges.js';
import type { OrthogonalRoute } from '../../lib/orthogonal-routing.js';
import type { MemberGroupIndex } from './geometry.js';
/** Keep routing off the pointer/render thread; coalesce requests and discard obsolete graph results. */
export declare function useEdgeRoutes(edges: CanvasEdge[], byId: Map<string, CanvasNode>, members: MemberGroupIndex, labels: LineLabelCopy, documentKey?: string, dragging?: boolean, routingRevision?: number): {
    routes: Map<string, OrthogonalRoute>;
    connectedPorts: string[];
    isRouting: boolean;
};
