import type { Dict } from '../../i18n.js';
export declare function NodeEditToolbar({ copy, x, y, canCopy, canReference, locked, onCopy, onReference, onDelete, onClose }: {
    copy: Dict;
    x: number;
    y: number;
    canCopy: boolean;
    canReference: boolean;
    locked: boolean;
    onCopy(): void;
    onReference(): void;
    onDelete(): void;
    onClose(): void;
}): import("react").JSX.Element;
