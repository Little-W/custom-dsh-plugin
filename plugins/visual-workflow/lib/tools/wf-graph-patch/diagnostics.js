import { buildExecutionFlowDag, flowAliasIds, isFlowLine, reachableFlowIds } from '../../graph/dag.js';

/** Runtime topology facts, kept separate from the unmodified saved canvas. */
export function graphDiagnostics(doc, issues = []) {
    const aliases = flowAliasIds(doc.nodes);
    const dag = buildExecutionFlowDag(doc.nodes, doc.lines);
    const reachable = reachableFlowIds(dag, doc.nodes.filter(node => node.kind === 'start').map(node => node.id));
    return {
        issues,
        aliases: [...aliases].map(([nodeId, sourceNodeId]) => ({ nodeId, sourceNodeId })),
        reachableNodeIds: [...reachable],
        unreachableNodeIds: dag.nodeIds.filter(id => !reachable.has(id)
            && ((dag.incoming.get(id)?.length ?? 0) + (dag.adjacency.get(id)?.length ?? 0) > 0)),
    };
}

/** Bounded, targeted evidence. Never present rejected operations as saved state. */
export function unchangedState(doc, input, candidate = doc, issues = []) {
    const related = new Set(issues.flatMap(issue => issue.nodeIds ?? []));
    const aliases = flowAliasIds(candidate.nodes);
    for (const [alias, main] of aliases) {
        if (related.has(alias) || related.has(main)) { related.add(alias); related.add(main); }
    }
    const briefLine = line => ({ id: line.id, source: line.source, target: line.target,
        sourceHandle: line.sourceHandle, targetHandle: line.targetHandle,
        ...(line.condition ? { condition: line.condition } : {}),
        ...(aliases.has(line.source) ? { resolvedSource: aliases.get(line.source) } : {}),
        ...(aliases.has(line.target) ? { resolvedTarget: aliases.get(line.target) } : {}),
    });
    const relevant = line => related.has(line.source) || related.has(line.target)
        || related.has(aliases.get(line.source)) || related.has(aliases.get(line.target));
    const savedLines = related.size ? doc.lines.filter(relevant) : doc.lines;
    const proposedLines = candidate.lines.filter(line => isFlowLine(line) && relevant(line));
    const diagnostics = graphDiagnostics(candidate);
    const repair = {
        scope: input.scope, targetId: input.targetId, revision: doc.revision ?? 0,
        savedNodeCount: doc.nodes.length, savedLineCount: doc.lines.length,
        aliases: diagnostics.aliases.filter(alias => related.has(alias.nodeId) || related.has(alias.sourceNodeId)).slice(0, 20),
        savedRelatedLines: savedLines.slice(0, 20).map(briefLine),
        proposedRelatedFlowLines: proposedLines.slice(0, 20).map(briefLine),
        unreachableNodeIdsInProposal: diagnostics.unreachableNodeIds.slice(0, 30),
        truncated: savedLines.length > 20 || proposedLines.length > 20 || diagnostics.unreachableNodeIds.length > 30,
    };
    return `Nothing was persisted; currentRevision=${doc.revision ?? 0}. Do not delete nodes/lines that existed only in a rejected patch. `
        + `Repair context (savedRelatedLines are saved; proposedRelatedFlowLines are NOT saved): ${JSON.stringify(repair)}. `
        + `Read this exact saved target with wf_graph_patch({action:"read",scope:${JSON.stringify(input.scope)},targetId:${JSON.stringify(input.targetId)}}); `
        + 'use update_node_data for existing nodes and only disconnect lines present in saved state. '
        + 'For a topology change, repair the intended upstream/downstream connections in one batch; use action="validate" with the same ops and expectRevision to check without saving. '
        + "wf_org_catalog's asset library is not a readback of this template.";
}
