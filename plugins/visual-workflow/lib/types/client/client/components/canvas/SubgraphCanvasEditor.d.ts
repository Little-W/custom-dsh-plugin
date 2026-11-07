import type { Dict } from '../../i18n.js';
import type { CanvasEdge, CanvasNode } from '../../studio/studio-state.js';
export interface SubgraphCanvasEditorProps {
    node: CanvasNode;
    copy: Dict & {
        modeName(id: string | null | undefined): string;
    };
    mode: 'mode1' | 'mode2';
    onClose(): void;
    /** 每次本地编辑都把完整内部图写回父节点 data.graph。 */
    onDraftChange(nodes: CanvasNode[], edges: CanvasEdge[]): void;
    presets: Array<{
        id: string;
        name?: string;
    }>;
    models: Array<{
        provider: string;
        model: string;
        efforts?: Array<{
            id: string;
            name: string;
        }>;
    }>;
    combos: Array<{
        id: string;
        name: string;
        tools?: string[];
        mcpServers?: string[];
    }>;
    flowTemplates?: import('../../../host/shared/graph-model.js').WorkflowTemplate[];
    maxActiveSubagents?: number;
    runtimeFocus?: boolean;
    runStatusByNode?: Record<string, {
        status: string;
        attempts: number;
        outputSummary: string;
    }>;
    /** 侧栏保存：调用主文档保存（内部图已即时写回父节点）。 */
    onSave?(): void;
}
export declare function SubgraphCanvasEditor({ node, copy, mode, onClose, onDraftChange, presets, models, combos, flowTemplates, onSave, maxActiveSubagents, runtimeFocus, runStatusByNode }: SubgraphCanvasEditorProps): import("react").JSX.Element;
