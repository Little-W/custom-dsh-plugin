import assert from 'node:assert/strict';
import test from 'node:test';
import { executeGraphPatch, registerWfGraphPatch } from '../lib/tools/wf-graph-patch/tool.js';
import { checkGraphInvariants } from '../lib/graph/invariants.js';
import { normalizeRoleNodeData } from '../lib/tools/wf-graph-patch/apply.js';
import { stageLabel } from '../lib/graph/model.js';
import { planFeedbackRetry, commitFeedbackRetry } from '../lib/orchestrator/feedback-budget.js';
import { buildResumedSnapshot } from '../lib/orchestrator/resume.js';
import { RuntimeExecute } from '../lib/orchestrator/runtime-execute.js';
import { executeOrgCatalog, registerWfOrgCatalog } from '../lib/tools/wf-org-catalog/tool.js';

const role = id => ({ id, kind: 'agent', position: { x: 0, y: 0 }, data: normalizeRoleNodeData({ label: id, systemPrompt: 'saved role instructions', retryLimit: 5 }) });
const stage = (id, kind) => ({ id, kind, position: { x: 0, y: 0 }, data: { label: stageLabel(kind, 'mode1') } });
const line = (id, source, target, type) => ({ id, source, target, sourceHandle: 'flow-out', targetHandle: 'flow-in', ...(type ? { condition: { type } } : {}) });
function graph() {
    return { id: 'tpl-test', revision: 15, mode: 'mode1', name: 'review workflow', nodes: [stage('start', 'start'), role('ui-designer'), role('dsh-session-port'), role('functional-acceptance'), role('ui-review'), stage('end', 'end'), { id: 'task-ui', kind: 'task', data: { label: 'task title', content: 'actual saved task body' } }], lines: [line('a', 'start', 'ui-designer'), line('b', 'ui-designer', 'dsh-session-port'), line('c', 'dsh-session-port', 'functional-acceptance'), line('d', 'functional-acceptance', 'ui-review'), line('pass', 'ui-review', 'end', 'pass'), { id: 'ctx', source: 'task-ui', target: 'ui-designer', sourceHandle: 'ctx-out', targetHandle: 'ctx-in' }] };
}
function hostOf(initial = graph()) {
    let saved = structuredClone(initial), writes = 0;
    return {
        get saved() { return saved; }, get writes() { return writes; },
        store: {
            async getFlowTemplate(id) { return id === saved.id ? structuredClone(saved) : null; },
            async listFlowTemplates() { return [{ ...structuredClone(saved), name: 'Mobile-DSH 原生体验重构与验收', description: '原生体验重构' }, { id: 'tpl-unrelated', name: '其他工作流', description: '另一个模板', mode: 'mode1', revision: 2 }]; },
            async getWorkflow() { return null; }, async getServiceAsFlow() { return null; }, async listToolCombos() { return []; },
            async saveFlowTemplate(doc, options) { assert.equal(options.expectedRevision, saved.revision); writes++; saved = structuredClone({ ...doc, revision: saved.revision + 1 }); return saved; },
        },
    };
}
const patch = ops => ({ scope: 'template', targetId: 'tpl-test', expectRevision: 15, ops });

test('saved workflow discovery finds exact editable template and leads into read/apply flow', async () => {
    const host = hostOf();
    const found = await executeOrgCatalog(host, { templateQuery: 'Mobile-DSH 原生体验重构与验收' });
    assert.equal(found.kind, 'templates');
    assert.equal(found.total, 1);
    assert.equal(found.templates[0].id, 'tpl-test');
    assert.equal(found.templates[0].revision, 15);
    assert.equal('nodes' in found.templates[0], false, 'search should stay compact');
    assert.match(found.nextStep, /action:"read"/);
    const loaded = await executeGraphPatch(host, 'session-test', { action: 'read', scope: 'template', targetId: found.templates[0].id, includePrompts: true });
    assert.equal(loaded.revision, found.templates[0].revision);
    assert.equal(loaded.graph.nodes.find(node => node.id === 'task-ui').data.content, 'actual saved task body');
});

test('template search ranks exact names first, bounds results, and rejects ambiguous arguments', async () => {
    const host = hostOf();
    host.store.listFlowTemplates = async () => [
        { id: 'tpl-prefix', name: 'Mobile-DSH related', description: '', mode: 'mode1', revision: 2 },
        { id: 'tpl-exact', name: 'Mobile-DSH', description: '', mode: 'mode1', revision: 7 },
        { id: 'tpl-description', name: 'Another', description: 'Mobile-DSH notes', mode: 'mode1', revision: 1 },
    ];
    const found = await executeOrgCatalog(host, { templateQuery: 'Mobile-DSH', limit: 1 });
    assert.equal(found.templates[0].id, 'tpl-exact');
    assert.equal(found.total, 3);
    assert.equal(found.truncated, true);
    for (const args of [
        { templateQuery: '  ' },
        { templateQuery: 'flow', limit: 21 },
        { templateQuery: 'flow', ids: ['flow-1'] },
        { templateQuery: 'flow', ids: 'bad' },
        { limit: 5 },
    ]) await assert.rejects(executeOrgCatalog(host, args), /WF_BAD_ARGS/);
});

test('registered catalog schema exposes templateQuery and its targeted next step', () => {
    const host = hostOf(); let definition;
    registerWfOrgCatalog({ get: () => ({ register(value) { definition = value; return () => {}; } }) }, host);
    assert.equal(definition.parameters.properties.templateQuery.type, 'string');
    assert.match(definition.parameters.properties.templateQuery.description, /tpl-\* id and revision/);
    assert.equal(definition.parameters.properties.limit.type, 'number');
    assert.match(definition.description, /do not guess template or runtime instance ids/);
});

test('real review return is accepted without duplicating the designer', async () => {
    const host = hostOf();
    const result = await executeGraphPatch(host, 'session-test', patch([{ op: 'connect', source: 'ui-review', target: 'ui-designer', condition: { type: 'fail', label: 'retry same designer' } }]));
    assert.equal(result.revision, 16); assert.equal(host.writes, 1);
    assert.equal(host.saved.nodes.filter(node => node.id === 'ui-designer').length, 1);
    assert.equal(checkGraphInvariants({ flow: host.saved }).some(issue => issue.code === 'flowCycle'), false);
});

test('unconditional, content and pass cycles still fail atomically with saved-state evidence', async () => {
    for (const type of [undefined, 'content', 'pass']) {
        const host = hostOf();
        await assert.rejects(executeGraphPatch(host, 's', patch([{ op: 'connect', source: 'ui-review', target: 'ui-designer', ...(type ? { condition: { type, label: 'not a failure return' } } : {}) }])), error => {
            assert.match(error.message, /flowCycle/); assert.match(error.message, /currentRevision=15/); assert.match(error.message, /action:"read"/); return true;
        });
        assert.equal(host.writes, 0);
    }
});

test('failure cycles require a closing pass path and finite integer retry limit', () => {
    for (const change of [flow => flow.lines.splice(flow.lines.findIndex(edge => edge.id === 'pass'), 1), flow => { flow.nodes.find(node => node.id === 'ui-designer').data.retryLimit = Infinity; }, flow => { flow.nodes.find(node => node.id === 'ui-designer').data.retryLimit = 1.5; }]) {
        const flow = graph(); flow.lines.push(line('back', 'ui-review', 'ui-designer', 'fail')); change(flow);
        assert.ok(checkGraphInvariants({ flow }).some(issue => issue.code === 'flowCycle'));
    }
});

test('connected Team members need no separate flow edges and genuine orphan nodes still fail', () => {
    const flow = graph();
    flow.nodes.push({ id: 'team', kind: 'group', data: { label: 'Team', memberIds: ['engineer', 'auditor'] } }, ...['engineer', 'auditor'].map(id => ({ ...role(id), data: { ...role(id).data, groupId: 'team' } })));
    flow.lines.push(line('team-in', 'start', 'team'), line('team-out', 'team', 'end'));
    assert.equal(checkGraphInvariants({ flow }).some(issue => issue.code === 'orphanNode'), false);
    flow.nodes.push(role('unconnected'));
    assert.ok(checkGraphInvariants({ flow }).some(issue => issue.code === 'orphanNode' && issue.nodeIds.includes('unconnected')));
});

test('mode1 pause gate can close a failure path', async () => {
    const host = hostOf();
    await executeGraphPatch(host, 's', patch([{ op: 'create_node', node: stage('review-pause', 'pause') }, { op: 'connect', source: 'ui-review', target: 'review-pause', condition: { type: 'fail' } }, { op: 'connect', source: 'review-pause', target: 'end' }]));
    assert.equal(host.writes, 1);
});

test('failed batch leaves all data unchanged; read sees saved target, not failed input or catalog assets', async () => {
    const host = hostOf();
    await assert.rejects(executeGraphPatch(host, 's', patch([{ op: 'update_node_data', nodeId: 'ui-designer', data: { systemPrompt: 'NOT SAVED' } }, { op: 'remove_node', nodeId: 'ui-rework-pause' }])), /currentRevision=15/);
    const read = await executeGraphPatch(host, 's', { action: 'read', scope: 'template', targetId: 'tpl-test', includePrompts: true });
    assert.equal(read.readOnly, true); assert.equal(read.applied, 0); assert.equal(read.revision, 15);
    assert.equal(read.graph.nodes.find(node => node.id === 'ui-designer').data.systemPrompt, 'saved role instructions');
    assert.equal(read.graph.nodes.find(node => node.id === 'task-ui').data.content, 'actual saved task body');
    assert.equal(host.writes, 0);
    const brief = await executeGraphPatch(host, 's', { action: 'read', scope: 'template', targetId: 'tpl-test' });
    assert.equal('systemPrompt' in brief.graph.nodes.find(node => node.id === 'ui-designer').data, false);
    await assert.rejects(executeGraphPatch(host, 's', { action: 'read', scope: 'template', targetId: 'tpl-test', ops: [] }), /must omit ops/);
});

test('optimistic conflict is reported before interpreting stale operations', async () => {
    const host = hostOf();
    await assert.rejects(executeGraphPatch(host, 's', { ...patch([{ op: 'remove_node', nodeId: 'phantom' }]), expectRevision: 14 }), /expectRevision=14, currentRevision=15/);
    assert.equal(host.writes, 0);
});

test('legacy allowance cannot hide a newly introduced orphan with the same issue code', async () => {
    const initial = graph(); initial.nodes.push(role('old-orphan'));
    const host = hostOf(initial);
    await assert.rejects(executeGraphPatch(host, 's', patch([{ op: 'create_node', node: role('new-orphan') }])), /new-orphan/);
    assert.equal(host.writes, 0);
    await executeGraphPatch(host, 's', patch([{ op: 'update_node_data', nodeId: 'ui-designer', data: { systemPrompt: 'valid change despite old orphan' } }]));
    assert.equal(host.writes, 1);
});

test('read redacts structured credentials and its fields are declared in the registered tool schema', async () => {
    const initial = graph(); initial.nodes.push({ id: 'db', kind: 'database', data: { conn: { user: 'tester', password: 'private-test-password' } } });
    const host = hostOf(initial), read = await executeGraphPatch(host, 's', { action: 'read', scope: 'template', targetId: 'tpl-test' });
    assert.equal(read.graph.nodes.at(-1).data.conn.password, '[redacted]');
    let definition; registerWfGraphPatch({ get: () => ({ register(value) { definition = value; return () => {}; } }) }, host);
    for (const key of Object.keys(read)) assert.ok(key in definition.output.schema.properties, key);
    assert.equal(definition.parameters.required.includes('ops'), false);
});

test('review feedback is limited to five retries despite successful implementation turns, survives resume, and deduplicates a review turn', () => {
    const flow = graph(); flow.lines.push(line('back', 'ui-review', 'ui-designer', 'fail'));
    const iso = seconds => new Date(100000 + seconds * 1000).toISOString();
    let snapshot = { id: 'run', flowId: flow.id, sessionId: 's', mode: 'mode1', status: 'running', startedAt: iso(0), nodes: [{ nodeId: 'ui-designer', status: 'ok', attempts: 1, startedAt: iso(0), endedAt: iso(1) }, { nodeId: 'ui-review', status: 'ok', attempts: 1, startedAt: iso(2), endedAt: iso(3) }] };
    for (let round = 1; round <= 5; round++) {
        const retry = planFeedbackRetry(snapshot, flow, 'ui-designer', 5); assert.ok(retry);
        commitFeedbackRetry(snapshot, retry);
        assert.equal(planFeedbackRetry(snapshot, flow, 'ui-designer', 5), null);
        const target = snapshot.nodes.find(node => node.nodeId === 'ui-designer'), source = snapshot.nodes.find(node => node.nodeId === 'ui-review');
        target.startedAt = iso(round * 10); target.endedAt = iso(round * 10 + 1);
        source.startedAt = iso(round * 10 + 2); source.endedAt = iso(round * 10 + 3);
        if (round === 3) {
            snapshot = buildResumedSnapshot({ prev: snapshot, flow, runId: 'resumed', sessionId: 's', mode: 'mode1', now: 200000 });
            assert.equal(snapshot.feedbackRetries['ui-designer'].count, 3);
        }
    }
    assert.throws(() => planFeedbackRetry(snapshot, flow, 'ui-designer', 5), /exhausted its review-feedback budget/);
    assert.equal(snapshot.feedbackRetries['ui-designer'].count, 5);
});

test('actual dispatch persists review usage before starting the child and blocks dispatch at the limit', async () => {
    const flow = graph(); flow.lines.push(line('back', 'ui-review', 'ui-designer', 'fail'));
    const snapshot = { id: 'run', flowId: flow.id, sessionId: 's', mode: 'mode1', status: 'running', nodes: [{ nodeId: 'ui-designer', status: 'ok', attempts: 1, startedAt: '2026-01-01T00:00:00Z', endedAt: '2026-01-01T00:00:01Z' }, { nodeId: 'ui-review', status: 'ok', attempts: 1, endedAt: '2026-01-01T00:00:02Z' }] };
    const run = { snapshot, controller: new AbortController(), callCount: 0, dispatching: new Set(), attempts: new Map(), inflight: new Set(), waiters: new Map() };
    const order = [], runtime = Object.create(RuntimeExecute.prototype);
    Object.assign(runtime, { deps: { config: { retryLimitDefault: 3, documentTextLimit: 1000 }, runner: { async startNodeTask() { order.push('start'); return { childId: 'child' }; } } }, childIndex: new Map(), childByNode: new Map(), now: () => Date.parse('2026-01-01T00:00:03Z'), requireRootRun: async () => run, currentResolvedFlow: async () => flow, markParentExecutorDone() {}, assertDecisionRecorded() {}, async persistWarn() { order.push('persist'); assert.equal(snapshot.feedbackRetries['ui-designer'].count, 1); } });
    const result = await runtime.wfRunNode({ sessionId: 's' }, { nodeId: 'ui-designer' });
    assert.equal(result.status, 'started'); assert.deepEqual(order, ['persist', 'start', 'persist']);
    snapshot.nodes[0].status = 'ok'; snapshot.nodes[1].endedAt = '2026-01-01T00:00:04Z';
    snapshot.feedbackRetries['ui-designer'].count = 5;
    await assert.rejects(runtime.wfRunNode({ sessionId: 's' }, { nodeId: 'ui-designer' }), /review-feedback budget/);
    assert.deepEqual(order, ['persist', 'start', 'persist']);
});
