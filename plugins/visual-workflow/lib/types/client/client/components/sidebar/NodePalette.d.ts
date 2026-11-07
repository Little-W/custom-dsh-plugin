import type { Dict } from '../../i18n.js';
import type { CanvasNode } from '../../lib/canvas-model.js';
import type { NodeKind } from '../../../host/shared/graph-model.js';
import type { DragPayload } from './LeftPanel.js';
export declare function NodePalette({ copy, nodes, kinds, references, query, disabled, onPlace, onBeginDrag }: {
    copy: Dict;
    nodes: CanvasNode[];
    kinds: NodeKind[];
    references?: boolean;
    query?: string;
    disabled: boolean;
    onPlace(kind: NodeKind, position?: {
        x: number;
        y: number;
    }, sourceId?: string): void;
    onBeginDrag(event: React.PointerEvent, payload: DragPayload): void;
}): import("react").JSX.Element;
