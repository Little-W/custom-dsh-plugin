import type { CanvasNode } from './canvas-model.js';
import type { NodeKind } from '../../host/shared/graph-model.js';
/** Blank cards are editable immediately; role tools come from the standard preset. */
export declare function blankNode(kind: NodeKind, id: string, label: string, position: {
    x: number;
    y: number;
}, selection?: {
    provider?: unknown;
    model?: unknown;
}, mode?: 'mode1' | 'mode2'): CanvasNode;
/** Copy configuration without aliasing nested data or borrowing external edges/membership. */
export declare function duplicateNodes(node: CanvasNode, nodes: CanvasNode[], newId: () => string, label: string, position: {
    x: number;
    y: number;
}): CanvasNode[];
