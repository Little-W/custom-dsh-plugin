// src/host/orchestrator/graph-facts.ts
//
// 图推导与节点上下文「事实」纯函数（供运行时与单测共用）：
//   - 节点/流程推导：labelOf、pauseNodeIdsOf、orchestrationNodeList、collabGroupList、
//     collabPromptOf、commTargetsOf（可通信对象清单）；
//   - 运行前完整性：missingStageLabels、validateFlowForRun；
//   - 节点执行上下文事实：dbToolHintOf、buildNodeContextFacts（上游产出/文件路径/db 提示）。
// 全部为纯函数（不读时钟/随机源），不依赖全局状态。
import { isEnglishSystemLanguage } from '../system-language.js';
import { renderTemplate, RULE_DB_TOOL, RULE_DB_TOOL_EN } from '../prompts/index.js';
import { autoContextSourceIds, ctxInEdges, dbInEdges, nodeById, nodeParticipatesInFlow, proceduralStepPromptsOf, validateFlow } from '../graph/index.js';
import { PARENT_TARGET } from './send-message-protocol.js';
import { hasProducedOutput, truncateText } from './snapshot.js';
import { WfError } from './errors.js';
/**
 * 生成某节点的数据库工具说明（正文见 prompts/texts/rule-db-tool.ts）。
 * - 存在 db-in 连线时，返回包含所连数据节点 id 与 label 的提示——子代理必须把该 id
 *   作为 wf_db_query 的 dataId 传入（BUG 修复：此前提示未携带 id，子代理无法定位数据源，
 *   只能用猜测的 id → WF_DB_BAD_DATA）。
 * - 无 db-in 连线时返回空串（工具白名单也不注入 wf_db_query）。
 * 纯函数：输入同则输出同，不读时钟/随机源。
 */
export function dbToolHintOf(flow, nodeId, systemLanguage) {
    const sources = dbInEdges(flow, nodeId)
        .map((line) => nodeById(flow, line.source))
        .filter((n) => n?.kind === 'database');
    if (sources.length === 0)
        return '';
    const ids = sources.map((n) => `${n.id} (${labelOf(n)})`).join('; ');
    return renderTemplate(isEnglishSystemLanguage(systemLanguage) ? RULE_DB_TOOL_EN : RULE_DB_TOOL, { sources: ids });
}
/** 节点人类可读名称（提示语与错误消息用）。 */
export function labelOf(node) {
    if (node.kind === 'proxy')
        return node.id;
    if (node.kind === 'parent' || node.kind === 'agent')
        return node.data.label || node.id;
    if (node.kind === 'group')
        return node.data.label || node.id;
    if (node.kind === 'subgraph')
        return node.data.label || node.id;
    if (node.kind === 'task' || node.kind === 'step' || node.kind === 'database')
        return node.data.label || node.id;
    return node.data.label;
}
/** 流程中的暂停节点 id 清单（编排指令与节点任务块动态态共用）。 */
export function pauseNodeIdsOf(flow) {
    return flow.nodes.filter((n) => n.kind === 'pause').map((n) => n.id);
}
/**
 * 参与流程的可调度 agent 节点清单（catalog 的 `schedulable` 与编排调度口径的等价参照）。
 *
 * 编排指令**不再内联节点清单**：拓扑只经 wf_org_catalog 的 instance 通道召回，父代理自行读取
 * 每个节点的 schedulable 标记。本函数保留为「可调度单元」这一口径的唯一可测表达。
 * 「参与流程」判定：节点自身或其虚拟节点作为任一流程线（flow-out/flow-in）的源/目标；
 * 未参与流程的 agent 节点 = 用户批注的「不执行任务的无关节点」，不进入清单。
 * Team 卡片是包裹层（不是执行主体），proxy 镜像主节点 agent id 相同，
 * 阶段/文件/数据库均非可执行节点——一律不列入。
 */
export function orchestrationNodeList(flow) {
    return flow.nodes
        .filter((n) => n.kind === 'agent' && nodeParticipatesInFlow(flow, n.id))
        .map((n) => ({ id: n.id, label: labelOf(n) }));
}
/**
 * 编排指令 facts 的 Team 说明（Team 卡片 + 成员节点 id；仅列参与流程的 Team 卡片）。
 * Team 卡片只标出团队的执行位置，父代理按此逐个调度其成员节点（Team 卡片本身不可作为调度目标）。
 */
export function collabGroupList(flow) {
    return flow.nodes
        .filter((n) => n.kind === 'group' && nodeParticipatesInFlow(flow, n.id))
        .map((n) => ({
        groupId: n.id,
        label: n.data.label || n.id,
        memberIds: n.data.memberIds ?? [],
        ...(n.data.dynamic === true
            ? { dynamic: true, maxMembers: Number(n.data.maxMembers ?? 4), memberRolePrompt: String(n.data.memberRolePrompt ?? '') }
            : {}),
    }));
}
/**
 * 读取某角色节点所属 Team 的协作 Prompt（Team 卡片 data.collabPrompt；非组内成员返回空串）。
 *
 * 组节点上的 ctx-in 任务卡是「全组共享提示词」：它们不复制到每个成员节点，
 * 而是由本函数并入成员的组内说明，从而真正做到一份共享、全组可见。
 */
export function collabPromptOf(flow, nodeId) {
    const group = flow.nodes.find((n) => n.kind === 'group' && (n.data.memberIds ?? []).includes(nodeId));
    if (!group)
        return '';
    const parts = [String(group.data.collabPrompt ?? '').trim()];
    for (const edge of ctxInEdges(flow, group.id)) {
        const source = nodeById(flow, edge.source);
        if (source?.kind !== 'task')
            continue;
        const content = String(source.data.content ?? '').trim();
        if (content)
            parts.push(`## ${labelOf(source)}\n${content}`);
    }
    return parts.filter(Boolean).join('\n\n');
}
/**
 * 某节点的可通信对象清单（注入子代理任务块的「可通信对象」段）。
 *
 * 组成（用户裁决 2026-10）：父代理固定别名 + 本组其他成员节点；非组内成员只有父代理。
 * 上下游节点的 id 不进本清单——可通信面只由组关系决定，不由数据流决定。
 * 不列节点自身：wf_send_message 拒绝自投，列出只会误导模型。
 */
export function commTargetsOf(flow, nodeId, systemLanguage) {
    const targets = [{ label: isEnglishSystemLanguage(systemLanguage) ? 'Parent' : '父代理', id: PARENT_TARGET }];
    const group = flow.nodes.find((n) => n.kind === 'group' && (n.data.memberIds ?? []).includes(nodeId));
    if (!group)
        return targets;
    for (const id of group.data.memberIds ?? []) {
        if (id === nodeId)
            continue;
        const member = nodeById(flow, id);
        targets.push({ label: member ? labelOf(member) : id, id });
    }
    return targets;
}
/** 运行前完整性检查：缺失的启动/结束节点（按模式渲染中文名）。 */
export function missingStageLabels(flow) {
    const labels = [];
    if (!flow.nodes.some((n) => n.kind === 'start'))
        labels.push(flow.mode === 'mode2' ? '输入' : '启动');
    if (!flow.nodes.some((n) => n.kind === 'end'))
        labels.push(flow.mode === 'mode2' ? '输出' : '结束');
    return labels;
}
/** 运行前校验（防御：保存时已校验，此处拦截非法快照）。 */
export function validateFlowForRun(flow) {
    const validation = validateFlow(flow);
    if (!validation.ok) {
        return new WfError(`工作流校验未通过：${validation.issues[0]?.message ?? '未知问题'}`, 'WF_FLOW_INVALID');
    }
    return null;
}
/**
 * 节点执行上下文组装（纯函数）：上游产出 / 任务节点描述 / 数据库工具说明。
 * buildNodeBlocks（子代理任务块）与 prepareParentExecutor（父代理执行单元）共用，
 * 保证同一节点的上下文注入完全一致。
 *
 * 上游来源有两条（用户裁决 2026-10）：
 *   - 数据源：task 节点经 ctx 出线注入的任务描述（截断直通）——
 *     task 无流程线，只能靠手动连线，故该通道保留；
 *   - 流程前驱产出：全链路自动注入（autoContextSourceIds），无需手动连线。
 * 显式角色 ctx 连线补充已产出的上下文，不建立流程依赖；与流程前驱按主节点 id 去重。
 * Team 与上下游解耦，不参与注入。
 */
export function buildNodeContextFacts(input) {
    const { flow, node } = input;
    const upstreamContext = [];
    // Explicit context carries task text or an already-produced role output; it never schedules work.
    for (const edge of ctxInEdges(flow, node.id)) {
        const endpoint = nodeById(flow, edge.source);
        const src = endpoint?.kind === 'proxy' ? nodeById(flow, endpoint.proxySourceId) : endpoint;
        if (!src || src.id === node.id || upstreamContext.some(item => item.nodeId === src.id))
            continue;
        const entry = input.snapshot.nodes.find(item => item.nodeId === src.id);
        const content = src.kind === 'task' ? String(src.data.content ?? '').trim()
            : (src.kind === 'parent' || src.kind === 'agent') && entry && hasProducedOutput(entry.status) ? String(entry.output ?? '').trim() : '';
        if (content)
            upstreamContext.push({ nodeId: src.id, source: labelOf(src), content: truncateText(content, input.documentTextLimit) });
    }
    // ② 流程前驱产出（自动注入）：直接前驱按流程线声明顺序；无产出的阶段节点已在来源枚举里跳过。
    //    armed 必须算数：Team 成员回合结束即落 armed，排除它会使其产出永远传不到下游
    //    （组内信息静默断链）。判定与产出回写共用 snapshot.hasProducedOutput。
    for (const sourceId of autoContextSourceIds(flow, node.id)) {
        if (upstreamContext.some(item => item.nodeId === sourceId))
            continue;
        const src = nodeById(flow, sourceId);
        if (!src)
            continue;
        // 模式一的启动节点没有产出语义（模式二输入节点的产出即本次用户问题）
        if (src.kind === 'start' && flow.mode !== 'mode2')
            continue;
        const entry = input.snapshot.nodes.find((n) => n.nodeId === sourceId);
        if (!entry || !hasProducedOutput(entry.status))
            continue;
        const output = String(entry.output ?? '').trim();
        if (!output)
            continue;
        upstreamContext.push({
            nodeId: sourceId,
            source: labelOf(src),
            content: truncateText(output, input.documentTextLimit),
        });
    }
    // ③ 流程性任务：直接位于本节点之前的 step 提示词，按流程顺序追加。
    // 这是「agent 完成后再注入校验任务」的运行时通道，不是前置 ctx 注入。
    for (const step of proceduralStepPromptsOf(flow, node.id)) {
        if (upstreamContext.some((item) => item.nodeId === step.nodeId))
            continue;
        upstreamContext.push({ nodeId: step.nodeId, source: step.label, content: truncateText(step.content, input.documentTextLimit) });
    }
    return { upstreamContext, dbToolHint: dbToolHintOf(flow, node.id, input.systemLanguage ?? input.snapshot.systemLanguage) };
}
//# sourceMappingURL=graph-facts.js.map