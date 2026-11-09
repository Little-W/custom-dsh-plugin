import assert from 'node:assert/strict';
import test from 'node:test';
import { executeGraphPatch, registerWfGraphPatch } from '../lib/tools/wf-graph-patch/tool.js';
import { normalizeRoleNodeData } from '../lib/tools/wf-graph-patch/apply.js';
import { checkGraphInvariants } from '../lib/graph/invariants.js';
import { buildExecutionFlowDag, buildFlowDag } from '../lib/graph/dag.js';
import { feedbackFlowView } from '../lib/graph/feedback.js';
import { stageLabel } from '../lib/graph/model.js';

const role = id => ({ id, kind: 'agent', data: normalizeRoleNodeData({ label: id, retryLimit: 5, systemPrompt: 'fixture' }) });
const edge = (id, source, target, type) => ({ id, source, target, sourceHandle: 'flow-out', targetHandle: 'flow-in', ...(type ? { condition: { type } } : {}) });
const alias = (id, main) => ({ id, kind: 'proxy', proxySourceId: main, data: { autoLayoutReference: { edgeId: 'old-layout-edge', endpoint: 'target', originalId: main } } });
function topology() {
    return { id: 'tpl-proxy', name: 'proxy regression', mode: 'mode1', revision: 40,
        nodes: [{ id: 'start', kind: 'start', data: { label: stageLabel('start', 'mode1') } }, { id: 'end', kind: 'end', data: { label: stageLabel('end', 'mode1') } },
            ...['acceptance', 'session-rework', 'functional-retest', 'ui-review', 'lead'].map(role),
            alias('auto-ref-rework', 'session-rework'), alias('auto-ref-review', 'ui-review'), alias('auto-ref-lead', 'lead')],
        lines: [edge('entry', 'start', 'acceptance'), edge('pass', 'acceptance', 'ui-review', 'pass'),
            edge('fail', 'acceptance', 'auto-ref-rework', 'fail'), edge('rework', 'session-rework', 'acceptance'),
            edge('retest-pass', 'functional-retest', 'auto-ref-review', 'pass'), edge('retest-fail', 'functional-retest', 'end', 'fail'),
            edge('review-pass', 'ui-review', 'end', 'pass'), edge('review-fail', 'ui-review', 'auto-ref-lead', 'fail'), edge('lead-end', 'lead', 'end')],
    };
}
function hostOf(initial = topology()) {
    let doc = structuredClone(initial), writes = 0, refreshes = 0;
    return { get saved() { return doc; }, get writes() { return writes; }, get refreshes() { return refreshes; },
        store: {
            async getFlowTemplate(id) { return id === doc.id && !doc.sessionId ? structuredClone(doc) : null; },
            async getWorkflow(sessionId, id) { return doc.sessionId === sessionId && id === doc.id ? structuredClone(doc) : null; },
            async getServiceAsFlow() { return null; }, async listToolCombos() { return []; },
            async saveFlowTemplate(next, options) { assert.equal(options.expectedRevision, doc.revision); writes++; doc = structuredClone({ ...next, revision: doc.revision + 1 }); return doc; },
            async saveWorkflow(next, sessionId, options) { assert.equal(sessionId, doc.sessionId); return this.saveFlowTemplate(next, options); },
        },
        orchestrator: { async refreshActiveDefinitions() { refreshes++; } },
    };
}
const patch = (ops, extras = {}) => ({ scope: 'template', targetId: 'tpl-proxy', expectRevision: 40, ops, ...extras });

test('proxy-wired rework makes functional-retest reachable without duplicate main-role wiring', async () => {
    const host = hostOf();
    const before = structuredClone(host.saved);
    const op = { op: 'connect', source: 'session-rework', target: 'functional-retest' };
    const result = await executeGraphPatch(host, 's', patch([op]));
    assert.equal(result.applied, 1);
    assert.equal(result.revision, 41);
    assert.equal(host.writes, 1);
    assert.equal(checkGraphInvariants({ flow: host.saved }).some(issue => issue.code === 'unreachableFromStart'), false);
    assert.deepEqual(host.saved.nodes, before.nodes);
    assert.deepEqual(host.saved.lines.slice(0, before.lines.length), before.lines);
    assert.equal(host.saved.lines.some(line => line.source === 'acceptance' && line.target === 'session-rework'), false);
});

test('aliases resolve on both endpoints; visual DAG stays unchanged and real alias cycles fail', () => {
    const doc = topology();
    doc.nodes.push(alias('auto-ref-source', 'ui-review'));
    doc.lines = doc.lines.filter(line => line.id !== 'review-pass');
    doc.lines.push(edge('alias-out', 'auto-ref-source', 'end', 'pass'));
    const saved = structuredClone(doc);
    assert.ok(buildExecutionFlowDag(doc.nodes, doc.lines).adjacency.get('ui-review').includes('end'));
    assert.ok(buildFlowDag(doc.nodes, doc.lines).adjacency.get('auto-ref-source').includes('end'));
    assert.equal(checkGraphInvariants({ flow: doc }).some(issue => issue.code === 'unreachableFromStart'), false);
    assert.deepEqual(doc, saved);
    doc.lines.push(edge('bad-cycle', 'auto-ref-source', 'acceptance'));
    assert.ok(checkGraphInvariants({ flow: doc }).some(issue => issue.code === 'flowCycle'));
});

test('bounded failure feedback recognizes alias pass exits and remains separate from forward flow', () => {
    const doc = topology();
    doc.nodes.push(alias('review-return', 'ui-review'));
    doc.lines.push(edge('feedback', 'review-return', 'acceptance', 'fail'));
    const view = feedbackFlowView(doc);
    assert.ok(view.feedback.some(line => line.id === 'feedback' && line.sourceNodeId === 'ui-review' && line.targetNodeId === 'acceptance'));
    assert.equal(checkGraphInvariants({ flow: doc }).some(issue => issue.code === 'flowCycle'), false);
    doc.lines.find(line => line.id === 'feedback').condition.type = 'content';
    doc.lines.find(line => line.id === 'feedback').condition.label = 'not a retry';
    assert.ok(checkGraphInvariants({ flow: doc }).some(issue => issue.code === 'flowCycle'));
});

test('roles wired only through aliases are executable and pass/fail pairing uses the same role', () => {
    const doc = topology();
    doc.nodes.push(alias('acceptance-view', 'acceptance'));
    doc.lines = doc.lines.map(line => ({ ...line,
        source: line.source === 'acceptance' ? 'acceptance-view' : line.source,
        target: line.target === 'acceptance' ? 'acceptance-view' : line.target,
    }));
    doc.lines.find(line => line.id === 'pass').source = 'acceptance';
    const issues = checkGraphInvariants({ flow: doc });
    assert.equal(issues.some(issue => issue.code === 'startNoFlowOut'), false);
    assert.equal(issues.some(issue => issue.code === 'orphanNode' && issue.nodeIds.includes('acceptance')), false);
    assert.equal(issues.some(issue => issue.code === 'conditionMissingOpposite' && issue.nodeIds.includes('acceptance')), false);
    // No aliases may smuggle a database/ctx path into the executable graph.
    doc.lines.find(line => line.id === 'entry').sourceHandle = 'ctx-out';
    assert.ok(checkGraphInvariants({ flow: doc }).some(issue => issue.code === 'startNoFlowOut'));
});

test('read reports saved aliases/reachability and validate checks the proposal without writing', async () => {
    const host = hostOf();
    const args = patch([{ op: 'connect', source: 'session-rework', target: 'functional-retest' }]);
    const read = await executeGraphPatch(host, 's', { action: 'read', scope: args.scope, targetId: args.targetId });
    assert.equal(read.diagnostics.aliases.find(alias => alias.nodeId === 'auto-ref-rework').sourceNodeId, 'session-rework');
    const saved = structuredClone(host.saved);
    const checked = await executeGraphPatch(host, 's', { ...args, action: 'validate' });
    assert.equal(checked.readOnly, true); assert.equal(checked.validated, true);
    assert.equal(checked.applied, 0); assert.equal(checked.proposedOps, 1); assert.equal(checked.revision, 40);
    assert.ok(checked.diagnostics.reachableNodeIds.includes('functional-retest'));
    assert.deepEqual(host.saved, saved); assert.equal(host.writes, 0); assert.equal(host.refreshes, 0);
    const applied = await executeGraphPatch(host, 's', args);
    assert.equal(applied.applied, 1); assert.equal(applied.revision, 41);
    await assert.rejects(executeGraphPatch(host, 's', { ...args, action: 'validate' }), /WF_PATCH_CONFLICT/);
    assert.equal(host.writes, 1);
});

test('instance validation never refreshes live definitions and still enforces ownership/scope', async () => {
    const doc = { ...topology(), sessionId: 'owner', id: 'instance-proxy' };
    const host = hostOf(doc);
    await executeGraphPatch(host, 'owner', patch([{ op: 'connect', source: 'session-rework', target: 'functional-retest' }], { scope: 'instance', targetId: doc.id, action: 'validate' }));
    assert.equal(host.writes, 0); assert.equal(host.refreshes, 0);
    await assert.rejects(executeGraphPatch(host, 'other', patch([{ op: 'connect', source: 'session-rework', target: 'functional-retest' }], { scope: 'instance', targetId: doc.id, action: 'validate' })), /WF_ORG_NOT_FOUND/);
    await assert.rejects(executeGraphPatch(host, 'owner', patch([{ op: 'connect', source: 'session-rework', target: 'functional-retest' }], { targetId: doc.id, action: 'validate' })), /WF_SCOPE_INVALID/);
});

test('genuine islands fail atomically with targeted evidence of the unsaved proposal', async () => {
    const host = hostOf(), saved = structuredClone(host.saved);
    const args = patch([{ op: 'create_node', node: role('island-head') }, { op: 'create_node', node: role('island-tail') }, { op: 'connect', source: 'island-head', target: 'island-tail' }]);
    for (const action of ['apply', 'validate']) await assert.rejects(executeGraphPatch(host, 's', { ...args, action }), error => {
        assert.match(error.message, /unreachableFromStart/);
        assert.match(error.message, /currentRevision=40/);
        assert.match(error.message, /action:"read",scope:"template",targetId:"tpl-proxy"/);
        assert.match(error.message, /proposedRelatedFlowLines/);
        assert.match(error.message, /island-head/);
        assert.doesNotMatch(error.message, /"template" or "instance"/);
        assert.ok(error.message.length < 5000);
        return true;
    });
    assert.deepEqual(host.saved, saved); assert.equal(host.writes, 0);
});

test('read/validate result fields are declared and the registered schema exposes validate', async () => {
    const host = hostOf(); let def;
    registerWfGraphPatch({ get: () => ({ register(value) { def = value; return () => {}; } }) }, host);
    assert.ok(def.parameters.properties.action.enum.includes('validate'));
    for (const args of [{ action: 'read', scope: 'template', targetId: 'tpl-proxy' }, patch([{ op: 'connect', source: 'session-rework', target: 'functional-retest' }], { action: 'validate' })]) {
        const result = await executeGraphPatch(host, 's', args);
        for (const key of Object.keys(result)) assert.ok(key in def.output.schema.properties, key);
    }
});
