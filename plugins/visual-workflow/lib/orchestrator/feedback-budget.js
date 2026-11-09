import { feedbackFlowView } from '../graph/feedback.js';
import { WfError } from './errors.js';

/** Review failures are a separate budget: successful implementation turns must not reset it. */
export function planFeedbackRetry(snapshot, flow, nodeId, limit) {
    const target = snapshot.nodes.find(node => node.nodeId === nodeId);
    const history = snapshot.feedbackRetries?.[nodeId] ?? { count: 0, sourceTurns: [] };
    if (!target?.startedAt && !history.count) return null;
    const pending = feedbackFlowView(flow).feedback.filter(line => line.targetNodeId === nodeId).flatMap(line => {
        const source = snapshot.nodes.find(node => node.nodeId === line.sourceNodeId);
        if (!source?.endedAt || source.status === 'running' || (target?.startedAt && Date.parse(source.endedAt) <= Date.parse(target.startedAt))) return [];
        const decision = (snapshot.decisions ?? []).findLast(item => item.sourceNodeId === line.source && item.sourceTurnEndedAt === source.endedAt);
        if (decision && decision.lineId !== line.id) return [];
        const key = `${line.sourceNodeId}:${source.endedAt}`;
        return history.sourceTurns.includes(key) ? [] : [key];
    });
    if (!pending.length) return null;
    if (history.count >= limit) throw new WfError(`WF_RETRY_LIMIT: node "${nodeId}" exhausted its review-feedback budget (${limit} retries after the first execution). Successful implementation turns do not reset this budget. Stop through the failure/pause path and report the remaining defects.`, 'WF_RETRY_LIMIT');
    return { nodeId, value: { count: history.count + 1, sourceTurns: [...new Set([...history.sourceTurns, ...pending])] } };
}

export function commitFeedbackRetry(snapshot, retry) {
    if (retry) snapshot.feedbackRetries = { ...snapshot.feedbackRetries, [retry.nodeId]: retry.value };
}
