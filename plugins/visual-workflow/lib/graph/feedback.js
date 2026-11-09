import { buildExecutionFlowDag, isFlowLine } from './dag.js';

function reachable(dag, start, predicate) {
    const seen = new Set([start]), queue = [start];
    for (let i = 0; i < queue.length; i++) {
        if (predicate(queue[i])) return true;
        for (const next of dag.adjacency.get(queue[i]) ?? []) {
            if (!seen.has(next)) { seen.add(next); queue.push(next); }
        }
    }
    return false;
}

/** Failure feedback is separate from forward dependencies; never ignore arbitrary conditional cycles. */
export function feedbackFlowView(flow) {
    const nodes = flow?.nodes ?? [], lines = flow?.lines ?? [];
    const byId = new Map(nodes.map(node => [node.id, node]));
    const main = id => { const node = byId.get(id); return node?.kind === 'proxy' ? byId.get(node.proxySourceId) : node; };
    const forward = buildExecutionFlowDag(nodes, lines.filter(line => line.condition?.type !== 'fail'));
    const ends = new Set(nodes.filter(node => node.kind === 'end').map(node => node.id));
    const feedback = lines.filter(line => {
        if (!isFlowLine(line) || line.condition?.type !== 'fail') return false;
        const source = main(line.source), target = main(line.target);
        if (!source || !['agent', 'parent'].includes(source.kind) || target?.kind !== 'agent') return false;
        const limit = target.data?.retryLimit ?? 3;
        if (!Number.isInteger(limit) || limit < 0) return false;
        // A return goes back to an ancestor, with a separate pass path that can close.
        if (!reachable(forward, target.id, id => id === source.id)) return false;
        return lines.some(pass => isFlowLine(pass) && main(pass.source)?.id === source.id && pass.condition?.type === 'pass'
            && reachable(forward, main(pass.target)?.id ?? pass.target, id => ends.has(id)));
    }).map(line => ({ ...line, sourceNodeId: main(line.source).id, targetNodeId: main(line.target).id }));
    const feedbackIds = new Set(feedback.map(line => line.id));
    return { feedback, dag: buildExecutionFlowDag(nodes, lines.filter(line => !feedbackIds.has(line.id))) };
}
