// src/host/orchestrator/resume.ts
//
// 断点续跑纯函数与类型：恢复候选查找 + 继承快照构建。
//
// 续跑语义：
//   - paused（暂停门/窗口挂起）、interrupted（宿主重启中断）、stopped（用户停止）
//     以及 failed（运行出错）均可恢复：
//       · paused/interrupted 为原有可恢复集（暂停节点/宿主重启）；
//       · stopped 加入可恢复集（用户裁决修正：界面「停止」后点「运行/恢复」应断点
//         续跑而非从头重跑；stopped 保留终态语义——运行锁已释放、历史文案不变，
//         只有显式再运行才续跑）；
//   - 每次续跑生成一条新 run 记录（resumedFromRunId 追溯继承链），旧记录保持原状；
//   - 节点快照 = 全量节点：已 ok/react-capped 节点继承状态与完整输出（resumed 标记，
//     不重跑），其余节点（含被中断时 running 的）统一回退 pending 重新执行；
//   - 断点产出随继承快照重新可用，后续节点的 ctx 连线注入直接用新快照（已 ok 节点
//     的 output 字段）——无需额外回填通道。
import { RESUMABLE_RUN_STATUSES } from '../shared/protocol.js';
/**
 * 可恢复的 run 状态集合：
 *   paused=暂停门/窗口挂起断点；interrupted=宿主重启中断；stopped=用户停止（可续跑修正）。
 * 导出供运行时断点定位复用（runtime-base.ensureActiveRun 的磁盘兜底扫描与静默接续），
 * 避免两处各自维护一份可恢复状态清单而产生漂移。
 */
export const RESUMABLE_STATUSES = RESUMABLE_RUN_STATUSES;
/**
 * 查找可恢复的 run：
 *   - fromRunId 指定：磁盘记录必须存在且归属会话/工作流匹配且状态可恢复；
 *   - 未指定：该工作流上次运行可恢复时返回该记录；已完成后不回退旧断点。
 * 查无返回 null（由调用方区分「无断点」与「指定 run 不可恢复」两类语义）。
 */
export async function findResumableRun(store, input) {
    if (input.fromRunId) {
        const run = await store.getRun(input.fromRunId);
        if (!run)
            return null;
        if (run.sessionId !== input.sessionId || run.flowId !== input.flowId)
            return null;
        return isResumable(run) ? run : null;
    }
    const latest = (await store.listRuns(input.flowId, input.sessionId))[0];
    // Automatic continuation must never resurrect a superseded checkpoint after a newer completion.
    return latest && isResumable(latest) ? latest : null;
}
/** 状态是否可恢复。 */
function isResumable(run) {
    return RESUMABLE_STATUSES.includes(run.status);
}
/**
 * 构建继承快照（纯函数）：
 *   - 节点清单以「当前工作流」为准（恢复前画布可能已编辑）；
 *   - 旧 run 中 ok/react-capped 的节点继承状态、完整输出与摘要（resumed=true）；
 *   - 其余节点回退 pending（attempts/时间戳/输出清零），恢复后重新执行；
 *   - 断点字段：resumedFromRunId 追溯链、resumeFromNodeId 续跑起点。
 */
export function buildResumedSnapshot(input) {
    const { prev, runId, flow, sessionId, mode } = input;
    // Resume ordering must remain unambiguous even when two runs start within the same millisecond.
    const previousTime = Date.parse(prev.startedAt);
    const now = Math.max(input.now ?? Date.now(), Number.isFinite(previousTime) ? previousTime + 1 : 0);
    const prevByNode = new Map(prev.nodes.map((node) => [node.nodeId, node]));
    // 续跑起点（Bug 21）：暂停断点继承 prev.resumeFromNodeId（暂停节点 id）；
    // interrupted（宿主重启中断）时 prev 无暂停点，推断为「首个未完成节点」
    // （已 ok/react-capped 节点继承后不重跑，恢复从这里继续），避免起点不明确。
    const resumeFromNodeId = prev.resumeFromNodeId
        ?? flow.nodes.find((node) => {
            const prevNode = prevByNode.get(node.id);
            return !prevNode || (prevNode.status !== 'ok' && prevNode.status !== 'react-capped');
        })?.id;
    const nodes = (flow.nodes ?? []).map((node) => {
        const prevNode = prevByNode.get(node.id);
        if (prevNode && (prevNode.status === 'ok' || prevNode.status === 'react-capped')) {
            return {
                nodeId: node.id,
                status: prevNode.status,
                attempts: prevNode.attempts,
                startedAt: prevNode.startedAt,
                endedAt: prevNode.endedAt,
                output: prevNode.output,
                outputSummary: prevNode.outputSummary,
                ...(prevNode.turns ? { turns: structuredClone(prevNode.turns) } : {}),
                ...(prevNode.stopReason ? { stopReason: prevNode.stopReason } : {}),
                ...(prevNode.childId ? { childId: prevNode.childId } : {}),
                ...(prevNode.childSignature ? { childSignature: prevNode.childSignature } : {}),
                resumed: true,
            };
        }
        return {
            nodeId: node.id,
            status: 'pending',
            attempts: 0,
            startedAt: null,
            endedAt: null,
            output: '',
            outputSummary: '',
            ...(prevNode?.childId ? { childId: prevNode.childId } : {}),
            ...(prevNode?.childSignature ? { childSignature: prevNode.childSignature } : {}),
        };
    });
    return {
        id: runId,
        flowId: flow.id,
        flowName: flow.name ?? flow.id,
        sessionId,
        mode,
        status: 'running',
        startedAt: new Date(now).toISOString(),
        endedAt: null,
        summary: '',
        resumedFromRunId: prev.id,
        resumeFromNodeId,
        nodes,
        ...(prev.feedbackRetries ? { feedbackRetries: structuredClone(prev.feedbackRetries) } : {}),
        // 元参数冻结副本继承（D-13）：续跑沿用旧 run 冻结的预算，不重读模板/实例 meta
        // ——「冻结即冻结」，保证审计与后续评估能还原本次运行当时的约束。
        ...(prev.meta ? { meta: structuredClone(prev.meta) } : {}),
    };
}
/**
 * 从目标节点回滚（纯函数，作用于已构建的续跑快照）：
 *   - 目标必须是画布上存在的角色节点（agent/parent）；proxy 解析为主节点后校验；
 *   - 沿 `flow-out` 边做可达性 BFS，目标及其流程下游节点重置为 pending，
 *     清空产出/尝试数/时间戳/stopReason（保留 turns 历史供审计）；
 *   - 快照写回 `resumeFromNodeId` 与 `rollback` 事实，父代理从目标节点重新派发；
 *     未被目标覆盖的已完成分支保持继承（不做整体重跑）。
 *
 * @returns 被重置（失效）的节点 id 清单。
 * @throws 目标不存在 / 不是角色节点时抛出可行动错误（调用方转 WF_* 错误码）。
 */
export function rollbackFromNode(input) {
    const { snapshot, flow, targetNodeId, reason } = input;
    const requested = flow.nodes.find((node) => node.id === targetNodeId);
    if (!requested)
        throw new Error(`回滚目标节点不存在：${targetNodeId}（画布可能已被修改）`);
    const mainId = requested.kind === 'proxy' ? requested.proxySourceId : requested.id;
    const main = flow.nodes.find((node) => node.id === mainId);
    if (!main || (main.kind !== 'agent' && main.kind !== 'parent')) {
        throw new Error(`回滚目标必须是角色节点（agent/parent）：${targetNodeId}`);
    }
    // 流程下游可达性（只沿 flow-out；条件分支一并纳入，回滚后由 Leader 重新做分支决策）。
    const reachable = new Set([requested.id]);
    const queue = [requested.id];
    while (queue.length > 0) {
        const source = queue.shift();
        for (const line of flow.lines) {
            if (line.source !== source || line.sourceHandle !== 'flow-out')
                continue;
            if (reachable.has(line.target))
                continue;
            reachable.add(line.target);
            queue.push(line.target);
        }
    }
    // 虚拟节点本身没有快照记录：把其主节点一并失效，避免主节点保持旧 ok 状态。
    if (requested.kind === 'proxy')
        reachable.add(main.id);
    // 只重置可执行角色节点（agent/parent）的快照记录；start/end/pause/group/task/proxy 等
    // 非执行单元没有"回滚重跑"语义，保持原样（它们也不应出现在失效清单里）。
    const executableNodeIds = new Set(flow.nodes.filter((node) => node.kind === 'agent' || node.kind === 'parent').map((node) => node.id));
    const invalidated = [];
    for (const entry of snapshot.nodes) {
        if (!reachable.has(entry.nodeId) || !executableNodeIds.has(entry.nodeId))
            continue;
        entry.status = 'pending';
        entry.attempts = 0;
        entry.startedAt = null;
        entry.endedAt = null;
        entry.output = '';
        entry.outputSummary = '';
        delete entry.stopReason;
        delete entry.resumed;
        invalidated.push(entry.nodeId);
    }
    snapshot.resumeFromNodeId = requested.id;
    snapshot.rollback = {
        fromNodeId: requested.id,
        ...(reason && reason.trim() ? { reason: reason.trim() } : {}),
        at: new Date(input.now ?? Date.now()).toISOString(),
        invalidatedNodeIds: invalidated,
    };
    return invalidated;
}
//# sourceMappingURL=resume.js.map
