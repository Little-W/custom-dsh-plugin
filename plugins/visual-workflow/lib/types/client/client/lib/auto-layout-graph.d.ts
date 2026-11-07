import type { CanvasEdge, CanvasNode } from './canvas-model.js';
export interface AutoLayoutGraphOptions {
    autoReferences?: boolean;
}
/** Rebuild only untouched generated references. User references and manually extended cards remain intact. */
export declare function removeLayoutReferences(nodes: CanvasNode[], edges: CanvasEdge[]): {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
};
/** Horizontal phase layout, optionally substituting local role aliases for long return/cross-phase edges. */
export declare function autoLayoutGraph(nodes: CanvasNode[], edges: CanvasEdge[], options?: AutoLayoutGraphOptions): {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
};
