import type { Dict } from '../../../i18n.js';
export declare function TaskForm({ data, copy, onPatch, onFilesPicked, heading, contentLabel }: {
    data: Record<string, unknown>;
    copy: Dict;
    onPatch(patch: Record<string, unknown>): void;
    /** 多选文件回调：仅把路径追加进任务描述。 */
    onFilesPicked(files: File[]): void;
    heading?: string;
    contentLabel?: string;
}): import("react").JSX.Element;
