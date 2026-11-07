import type { CanvasEdge } from './canvas-model.js';
/** Release geometric constraints only; retain endpoints, semantic channels, conditions and line shape. */
export declare function autoRouteEdges(edges: CanvasEdge[]): CanvasEdge[];
