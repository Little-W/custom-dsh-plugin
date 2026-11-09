import type { WorkflowDocument, Line } from '../shared/graph-model.js';
import type { FlowDag } from './dag.js';
export declare function feedbackFlowView(flow: WorkflowDocument): {
    feedback: Array<Line & { sourceNodeId: string; targetNodeId: string }>;
    dag: FlowDag;
};
