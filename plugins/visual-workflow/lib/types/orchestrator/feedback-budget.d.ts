import type { WorkflowDocument } from '../shared/graph-model.js';
import type { RunSnapshot } from '../shared/run-types.js';
interface FeedbackRetry { nodeId: string; value: { count: number; sourceTurns: string[] } }
export declare function planFeedbackRetry(snapshot: RunSnapshot, flow: WorkflowDocument, nodeId: string, limit: number): FeedbackRetry | null;
export declare function commitFeedbackRetry(snapshot: RunSnapshot, retry: FeedbackRetry | null): void;
