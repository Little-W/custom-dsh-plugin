import type { Dict } from '../../i18n.js';
import type { LineAppearance } from '../../../host/shared/graph-model.js';
export declare function EdgeEditToolbar({ value, x, y, copy, onChange, onClose, onDelete }: {
    value: LineAppearance;
    x: number;
    y: number;
    copy: Dict;
    onChange(patch: LineAppearance): void;
    onClose?(): void;
    onDelete?(): void;
}): import("react").JSX.Element;
