import type { WorkflowTemplate } from '../../../../host/shared/graph-model.js';
import type { Dict } from '../../../i18n.js';
export declare function SubgraphForm({ data, copy, mode, flowTemplates, onPatch }: {
    data: Record<string, unknown>;
    copy: Dict;
    mode: 'mode1' | 'mode2';
    flowTemplates: WorkflowTemplate[];
    onPatch(patch: Record<string, unknown>): void;
}): import("react").JSX.Element;
