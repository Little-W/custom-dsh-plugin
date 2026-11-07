// src/host/orchestrator/runtime-execute.ts
//
// 编排运行时节点执行层（RuntimeExecute extends RuntimeLaunch）：wf_run_node
// （异步/暂停门/阻塞三路径）与 wf_finish（父代理收尾，幂等）。方法体逐字移动。
//
// 运行锁降权（用户裁决）：两者的运行上下文获取统一经 ensureActiveRun——本会话停在
// 非人工 paused/stopped/interrupted 断点时静默接续（只接管运行事实与锁，不注入编排
// 指令、不要求父代理空闲）；人工停止必须通过「继续」或 wf_resume 明确恢复。
import { WF_LOOP_COUNTER, WF_RUN_NODE_WAIT, WF_WAIT_AGENT } from '../shared/protocol.js';
import { isGroupMember, nodeById } from '../graph/index.js';
import { DEFAULT_SYSTEM_LANGUAGE } from '../system-language.js';
import { collabPromptOf, labelOf } from './graph-facts.js';
import { effectiveReactLimitOf, effectiveRetryLimitOf, effectiveThinkingOf } from './node-params.js';
import { roleIdentityOf } from './role-identity.js';
import { buildNodeBlocks } from './task-blocks.js';
import { WfError } from './errors.js';
import { createWaiter } from './run-entry.js';
import { RESUMABLE_STATUSES } from './resume.js';
import { hasProducedOutput, setNodeStatus, terminalizeNodes } from './snapshot.js';
import { GLOBAL_RUN_CALL_LIMIT } from './seams.js';
import { RuntimeLaunch } from './runtime-launch.js';
export class RuntimeExecute extends RuntimeLaunch {
    // ---- wf_run_node ----------------------------------------------------------
    /** 校验调用者为「当前会话根 Agent」并取可直接执行节点的激活运行（必要时静默接续）。 */
    async requireRootRun(caller, toolName) {
        if (caller.isChild)
            throw new WfError(`WF_NOT_ROOT: a child agent cannot call ${toolName}; only the session main agent may orchestrate`, 'WF_NOT_ROOT');
        const sessionId = caller.sessionId;
        if (!sessionId)
            throw new WfError('WF_BAD_CALLER: cannot identify the caller session', 'WF_BAD_CALLER');
        // 非人工断点可在父代理回合内静默接续；人工停止不得被迟到的调度调用重新打开。
        const run = await this.ensureActiveRun(sessionId);
        if (!run) {
            // 没有可自动接管的运行（包括人工停止）：提示明确恢复或启动。
            throw new WfError('WF_NO_ACTIVE_RUN: no active orchestration or automatic checkpoint; use Continue or wf_resume for a manually stopped workflow, or start a run on the canvas', 'WF_NO_ACTIVE_RUN');
        }
        return run;
    }
    /**
     * wf_run_node：启动一个角色节点的子代理。
     *   - 默认异步（模式一）：立即返回 { nodeId, status:'started', childId }；
     *   - wait:true 阻塞（模式二）：等待该节点子代理完成，返回 { nodeId, status:'ok'|'fail', childId, output }；
     *   - 暂停节点：触发暂停门（run=paused + 断点持久化 resumeFrom=暂停节点，锁保留）；
     *   - 非人工 paused/stopped/interrupted 断点先静默接续再调度；人工停止需明确恢复。
     */
    async wfRunNode(caller, args, callerSignal, options = {}) {
        const run = await this.requireRootRun(caller, options?.expectedMode === 'mode2' ? WF_RUN_NODE_WAIT : 'wf_run_node');
        // 模式与工具一一对应：wf_run_node 仅流程编排模式，wf_run_node_wait 仅API服务模式
        if (options?.expectedMode && run.snapshot.mode !== options.expectedMode) {
            throw new WfError(options.expectedMode === 'mode2'
                ? 'WF_MODE_MISMATCH: wf_run_node_wait only works in mode2 (API service runs)'
                : 'WF_MODE_MISMATCH: wf_run_node only works in mode1 (flow orchestration runs)', 'WF_MODE_MISMATCH');
        }
        const nodeId = String(args?.nodeId ?? '').trim();
        if (!nodeId)
            throw new WfError('WF_BAD_ARGS: wf_run_node requires nodeId', 'WF_BAD_ARGS');
        if (run.controller.signal.aborted)
            throw new WfError('WF_CANCELLED: the run has been stopped', 'WF_CANCELLED');
        // 执行者模式：父代理开始调度（首次 wf_run_node 成功前）→ 自身节点任务视为完成，
        // 快照标记 ok 并把父代理最近产出回写（下游 ctx 连线可注入该产出）
        this.markParentExecutorDone(run);
        // 双向同步①：每次调度前重读最新工作流快照（运行中画布调整即时生效）
        const flow = await this.currentResolvedFlow(run);
        // 虚拟节点解析为主节点（共享同一子代理执行实例）
        let node = nodeById(flow, nodeId);
        if (!node)
            throw new WfError(`WF_NODE_MISSING: node not found or removed from the canvas: ${nodeId}`, 'WF_NODE_MISSING');
        // A proxy is a visual alias, not a second execution unit. Remember the request came
        // through an alias so a second alias call cannot enqueue another turn on the same
        // running child agent.
        const requestedViaProxy = node.kind === 'proxy';
        if (node.kind === 'proxy') {
            const source = nodeById(flow, node.proxySourceId);
            if (!source)
                throw new WfError(`WF_NODE_MISSING: the proxy node's source node is missing: ${node.proxySourceId}`, 'WF_NODE_MISSING');
            node = source;
        }
        // 暂停门：暂停节点不派生子代理，run 置 paused + 断点持久化。
        // SLA：配置 pauseSlaMs > 0 时写入暂停时间与截止时间；看护扫描到期后把运行收敛为
        // stopped（保留可恢复断点），人工可用 wf_resume（可带 rollbackToNodeId）继续。
        if (node.kind === 'pause') {
            run.callCount += 1;
            if (run.callCount > GLOBAL_RUN_CALL_LIMIT) {
                throw new WfError(`WF_GLOBAL_LIMIT: orchestration exceeded the global call limit (${GLOBAL_RUN_CALL_LIMIT} wf_run_node calls)`, 'WF_GLOBAL_LIMIT');
            }
            const pausedAtMs = this.now();
            const pauseSlaMs = this.deps.config.pauseSlaMs ?? 0;
            run.lastActiveAt = pausedAtMs;
            setNodeStatus(run.snapshot, nodeId, 'ok', { attempts: 1, output: '(pause gate) run paused', now: pausedAtMs });
            run.snapshot.status = 'paused';
            run.snapshot.resumeFromNodeId = nodeId;
            run.snapshot.pausedAt = new Date(pausedAtMs).toISOString();
            if (pauseSlaMs > 0) {
                run.snapshot.pauseDeadlineAt = new Date(pausedAtMs + pauseSlaMs).toISOString();
            }
            else {
                delete run.snapshot.pauseDeadlineAt;
            }
            await this.persistWarn(run);
            return {
                nodeId,
                status: 'paused',
                ...(run.snapshot.pauseDeadlineAt === undefined ? {} : { pauseDeadlineAt: run.snapshot.pauseDeadlineAt }),
            };
        }
        // Team 卡片是包裹层，不是执行主体（用户裁决 2026-10）：它只能是流程上的位置锚点，
        // 成员节点才是执行单元。以组 id 启动整组属已退役的旧语义，明确拒绝并给出成员清单。
        if (node.kind === 'group') {
            const memberIds = [...new Set((node.data.memberIds ?? []).map((id) => String(id ?? '')).filter(Boolean))];
            throw new WfError(`WF_NODE_KIND: "${labelOf(node)}" is a Team card (a wrapper, not an execution unit). `
                + `Start its member nodes one by one with wf_run_node: [${memberIds.join(', ') || '(no members)'}].`, 'WF_NODE_KIND');
        }
        if (node.kind !== 'agent') {
            throw new WfError(`WF_NODE_KIND: wf_run_node only accepts an agent node; "${labelOf(node)}" is ${node.kind}`, 'WF_NODE_KIND');
        }
        // 模式二完全不支持 Team（用户裁决 2026-10）：阻塞等待语义与团队异步协作不匹配，
        // 成员节点在 wf_run_node_wait 通道下同样拒绝（模式一才允许）。
        if (run.snapshot.mode === 'mode2' && isGroupMember(flow, node.id)) {
            throw new WfError(`WF_NODE_KIND: wf_run_node_wait does not accept a Team member node ("${labelOf(node)}"); Team collaboration is available in mode1 only`, 'WF_NODE_KIND');
        }
        // 虚拟节点解析后一切以主节点 key 记账（共享同一子代理执行实例与快照记录）
        const resolvedNodeId = node.id;
        // 异步路径与阻塞路径（模式二 wait:true）共用本方法；去重只对异步路径生效。
        const waitRequested = args?.wait === true;
        // 并发派发去重（wf_run_node 优化）：把「启动窗口内」的重复派发收敛为一次——
        // 首次派发已通过护栏、但 startNodeTask 尚未返回时（dispatching 窗口），第二次同名
        // 调用直接返回 started（后续 childId 由首次调用登记），不创建第二个子代理、不消耗
        // 全局调用计数、不推进任务尝试预算。
        // 注意：**不**对「节点已 running」做去重——运行中再次派发是既有语义（向同一可延续
        // 子代理追加一轮任务/触发配置签名重建），由 runner 负责复用或替换，编排器不拦。
        if (!waitRequested && run.dispatching.has(resolvedNodeId)) {
            const snapshotEntry = run.snapshot.nodes.find((item) => item.nodeId === resolvedNodeId);
            const dedupeRetryLimit = effectiveRetryLimitOf(node, args, this.deps.config.retryLimitDefault);
            const dedupeAttempt = Math.max(1, run.attempts.get(resolvedNodeId) ?? snapshotEntry?.attempts ?? 1);
            const dedupeChildId = this.childByNode.get(resolvedNodeId);
            run.lastActiveAt = this.now();
            return {
                nodeId: resolvedNodeId,
                status: 'started',
                ...(dedupeChildId === undefined ? {} : { childId: dedupeChildId }),
                deduplicated: true,
                attempt: dedupeAttempt,
                retryLimit: dedupeRetryLimit,
                remainingRetries: Math.max(0, dedupeRetryLimit + 1 - dedupeAttempt),
            };
        }
        // Proxy aliases must not create a second logical turn while the source node is
        // already running. This is distinct from an explicit source-node re-dispatch.
        if (!waitRequested && requestedViaProxy) {
            const snapshotEntry = run.snapshot.nodes.find((item) => item.nodeId === resolvedNodeId);
            if (snapshotEntry?.status === 'running') {
                const dedupeRetryLimit = effectiveRetryLimitOf(node, args, this.deps.config.retryLimitDefault);
                const dedupeAttempt = Math.max(1, run.attempts.get(resolvedNodeId) ?? snapshotEntry.attempts ?? 1);
                const dedupeChildId = this.childByNode.get(resolvedNodeId);
                run.lastActiveAt = this.now();
                return {
                    nodeId: resolvedNodeId,
                    status: 'started',
                    ...(dedupeChildId === undefined ? {} : { childId: dedupeChildId }),
                    deduplicated: true,
                    attempt: dedupeAttempt,
                    retryLimit: dedupeRetryLimit,
                    remainingRetries: Math.max(0, dedupeRetryLimit + 1 - dedupeAttempt),
                };
            }
        }
        // 硬护栏：全局调用上限 + 单节点失败重试上限。
        run.callCount += 1;
        if (run.callCount > GLOBAL_RUN_CALL_LIMIT) {
            throw new WfError(`WF_GLOBAL_LIMIT: orchestration exceeded the global call limit (${GLOBAL_RUN_CALL_LIMIT} wf_run_node calls); stopped automatically`, 'WF_GLOBAL_LIMIT');
        }
        // retryLimit = **当前任务**的失败重试预算（per-task，而不是节点生命周期总量）：
        //   - 该节点上次已成功结算（ok / react-capped / armed）→ 本次是新任务，计数从 0 起；
        //   - 否则沿用当前任务的连续失败次数（含续跑时从快照继承的计数），避免用重启绕过预算。
        // 这样模块队列中同一工程师连续处理多个模块时，前面模块的偶发失败不会消耗后续模块预算。
        const snapshotNode = run.snapshot.nodes.find((item) => item.nodeId === resolvedNodeId);
        const previousStatus = snapshotNode?.status;
        const previousProducedOutput = previousStatus !== undefined && hasProducedOutput(previousStatus);
        const effectiveRetryLimit = effectiveRetryLimitOf(node, args, this.deps.config.retryLimitDefault);
        const carriedAttempts = previousProducedOutput
            ? 0
            : Math.max(run.attempts.get(resolvedNodeId) ?? 0, snapshotNode?.attempts ?? 0);
        const attempt = carriedAttempts + 1;
        run.attempts.set(resolvedNodeId, attempt);
        if (attempt > effectiveRetryLimit + 1) {
            throw new WfError(`WF_RETRY_LIMIT: node "${labelOf(node)}" exhausted its retry budget for the current task `
                + `(attempt ${attempt}, at most ${effectiveRetryLimit} retries after the first try). `
                + 'A new task resets the budget after a successful settlement; revise the upstream input, '
                + 'fix the root cause, or escalate through the pause gate instead of retrying blindly.', 'WF_RETRY_LIMIT');
        }
        const remainingRetries = Math.max(0, effectiveRetryLimit + 1 - attempt);
        const effectiveReactLimit = effectiveReactLimitOf(node, args, this.deps.config.reactIterationLimitDefault);
        const thinking = effectiveThinkingOf(node, args);
        run.lastActiveAt = this.now();
        // 条件分支决策门禁：分支点（该源节点的条件流程出边 ≥ 2 条）派发目标前，必须存在
        // 覆盖「分支节点最近一回合」的 wf_decide 记录，否则拒绝并列出候选分支。
        // 语义：把「Leader 按证据选路」从聊天语义变成可审计、可门禁的运行事实；
        // 简单线性流程（无条件出边或出边<2）不受影响。
        this.assertDecisionRecorded(run, flow, resolvedNodeId);
        // 启动子代理之前，为其 db-in 所连本地库预建索引：把构建耗时吸收到启动阶段，
        // 避免子代理首次检索才构建（延迟/「无索引」间歇）。best-effort：构建缺失/失败
        // 不阻塞节点启动，交由 wf_db_query(mode=search) 的惰性构建兜底。
        // 能力经依赖缝注入（编排器不反向依赖数据工具域）。
        if (this.deps.dbIndexer) {
            await this.deps.dbIndexer.ensureIndexes(resolvedNodeId, flow);
        }
        setNodeStatus(run.snapshot, resolvedNodeId, 'running', { attempts: attempt, now: this.now() });
        // 任务块统一组装：可通信对象清单对成员与非成员同一段注入（不再按协作通道分叉）
        const blocks = buildNodeBlocks({
            flow,
            node,
            snapshot: run.snapshot,
            documentTextLimit: this.deps.config.documentTextLimit,
            systemLanguage: run.snapshot.systemLanguage ?? this.deps.systemLanguage?.() ?? DEFAULT_SYSTEM_LANGUAGE,
        });
        // wait:true 阻塞等待器必须先于启动注册（subagent/end 可能在启动返回前到达）
        const waitKey = `${run.snapshot.id}:${resolvedNodeId}`;
        let waiter = null;
        if (waitRequested) {
            if (run.waiters.has(waitKey)) {
                throw new WfError(`节点「${labelOf(node)}」已有阻塞等待中的执行`, 'WF_BUSY');
            }
            waiter = createWaiter();
            run.waiters.set(waitKey, waiter);
        }
        run.dispatching.add(resolvedNodeId);
        try {
            const { childId, replacedChildId } = await this.deps.runner.startNodeTask({
                sessionId: run.snapshot.sessionId,
                flowId: run.snapshot.flowId,
                mode: run.snapshot.mode,
                node,
                blocks,
                signal: run.controller.signal,
                collabPrompt: collabPromptOf(flow, node.id),
                ...(isGroupMember(flow, node.id) ? { teamMember: true } : {}),
                ...(thinking !== undefined ? { thinking } : {}),
                ...(effectiveReactLimit !== undefined ? { iterationLimit: effectiveReactLimit } : {}),
            });
            if (run.controller.signal.aborted) {
                await this.deps.runner.interruptChild(childId, run.snapshot.sessionId);
                throw new WfError('WF_CANCELLED: the run has been stopped', 'WF_CANCELLED');
            }
            // 子代理重建（配置签名变化）：旧 child 已由引擎尽力中断，编排器侧把它的登记
            // **退役**并从 inflight 摘除——不删表项（否则其迟到事件走「未登记」重试路径刷
            // 告警），而是标记 retired 使其 subagent/end 静默丢弃。否则旧配置的产出会经同一
            // nodeId 覆写新子代理正在推进的节点状态（节点状态错位）。
            // 必须同时摘除 inflight：旧 child 被中断后可能不再产生 subagent/end，若留在
            // inflight 会让空闲看护永远认为「仍有子代理在跑」而永不收敛（该节点在途执行者
            // 已由新 child 代表，语义上不需要两个）。
            if (replacedChildId !== undefined) {
                run.inflight.delete(replacedChildId);
                const retired = this.childIndex.get(replacedChildId);
                if (retired)
                    this.childIndex.set(replacedChildId, { ...retired, retired: true });
            }
            run.inflight.add(childId);
            this.childIndex.set(childId, {
                sessionId: run.snapshot.sessionId,
                flowId: run.snapshot.flowId,
                nodeId: resolvedNodeId,
                // 角色身份在启动瞬间冻结：之后画布改角色名/资产引用不会改变这次使用的归属
                ...roleIdentityOf(node),
            });
            this.childByNode.set(resolvedNodeId, childId);
            if (!waitRequested) {
                return {
                    nodeId: resolvedNodeId,
                    status: 'started',
                    childId,
                    attempt,
                    retryLimit: effectiveRetryLimit,
                    remainingRetries,
                };
            }
        }
        catch (error) {
            if (waiter)
                run.waiters.delete(waitKey);
            if (run.snapshot.status === 'running')
                setNodeStatus(run.snapshot, resolvedNodeId, 'fail', { attempts: attempt, now: this.now() });
            throw error;
        }
        finally {
            // 启动窗口结束（无论成功/失败）：释放并发去重标记；节点状态本身由 running/fail 表达。
            run.dispatching.delete(resolvedNodeId);
        }
        // wait 阻塞：等待 subagent/end 唤醒（完成）或运行终止/调用取消（reject）
        const onAbort = () => {
            run.waiters.delete(waitKey);
            waiter.reject(new WfError('WF_CANCELLED: the run has been stopped', 'WF_CANCELLED'));
        };
        if (callerSignal && !callerSignal.aborted)
            callerSignal.addEventListener('abort', onAbort, { once: true });
        else if (callerSignal?.aborted)
            onAbort();
        try {
            return await waiter.promise;
        }
        finally {
            callerSignal?.removeEventListener('abort', onAbort);
        }
    }
    // ---- wf_loop_counter -------------------------------------------------------
    /** 通过性校验的循环计数器：按当前活跃 run + guardId 计数，超限后清零。 */
    async wfLoopCounter(caller, args) {
        if (!caller.sessionId)
            throw new WfError('WF_BAD_CALLER: cannot identify the caller session', 'WF_BAD_CALLER');
        const guardId = String(args?.guardId ?? '').trim();
        if (!guardId)
            throw new WfError('WF_BAD_ARGS: wf_loop_counter requires guardId', 'WF_BAD_ARGS');
        const action = args?.action === 'reset' ? 'reset' : 'tick';
        const rawLimit = Number(args?.limit);
        const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 4;
        const run = this.activeRunForSession(caller.sessionId);
        if (!run)
            throw new WfError('WF_NO_ACTIVE_RUN: loop counters are only available inside an active workflow run', 'WF_NO_ACTIVE_RUN');
        if (run.snapshot.status !== 'running')
            throw new WfError(`WF_RUN_NOT_RUNNING: cannot use ${WF_LOOP_COUNTER} while the run is ${run.snapshot.status}`, 'WF_RUN_NOT_RUNNING');
        if (!run.loopCounters)
            run.loopCounters = new Map();
        if (action === 'reset') {
            run.loopCounters.set(guardId, 0);
            return { guardId, action, count: 0, limit, exceeded: false, reset: true };
        }
        const count = (run.loopCounters.get(guardId) ?? 0) + 1;
        const exceeded = count > limit;
        // 超限即终止循环并清零，下一次进入子图循环从 0 重新计数。
        run.loopCounters.set(guardId, exceeded ? 0 : count);
        return { guardId, action, count, limit, exceeded, reset: exceeded };
    }
    // ---- wf_wait_agent --------------------------------------------------------
    /**
     * wf_wait_agent：等待已启动的任意工作流节点结算（普通子代理 / Team 成员均可）。
     *
     * 为什么不复用官方 wait_agent：官方 wait_agent 只观察官方 Team 成员；普通 agent
     * 节点（如 stage-spec）不在 Team roster 中，wait_agent 必然返回 no-active-peer，
     * 父代理只能退化成 bash 轮询。本工具以运行快照为事实源轮询节点状态，补上普通节点
     * 的可观察等待；不启动/不重派节点，只等待。
     */
    async wfWaitAgent(caller, args, callerSignal) {
        const run = await this.requireRootRun(caller, WF_WAIT_AGENT);
        const rawNodeId = String(args?.nodeId ?? '').trim();
        if (!rawNodeId)
            throw new WfError('WF_BAD_ARGS: wf_wait_agent requires nodeId', 'WF_BAD_ARGS');
        const rawTimeout = Number(args?.timeoutMs ?? 300000);
        const timeoutMs = Number.isFinite(rawTimeout) ? Math.min(3600000, Math.max(1000, rawTimeout)) : 300000;
        const startedAt = this.now();
        const deadline = startedAt + timeoutMs;
        // 节点可能在等待期间被改图删除；每轮重读最新实例文档，与 wf_run_node 同一事实源。
        let resolvedNodeId = rawNodeId;
        while (true) {
            if (callerSignal?.aborted)
                throw new WfError('WF_CANCELLED: the run has been stopped', 'WF_CANCELLED');
            const flow = await this.currentResolvedFlow(run);
            let node = nodeById(flow, rawNodeId);
            if (node?.kind === 'proxy')
                node = nodeById(flow, node.proxySourceId);
            if (node)
                resolvedNodeId = node.id;
            const entry = run.snapshot.nodes.find((item) => item.nodeId === resolvedNodeId);
            const status = entry?.status ?? 'pending';
            const terminal = status === 'ok' || status === 'fail' || status === 'skipped' || status === 'react-capped' || status === 'armed';
            if (terminal) {
                return {
                    nodeId: resolvedNodeId,
                    status,
                    runStatus: run.snapshot.status,
                    ...(entry?.outputSummary || entry?.output ? { output: entry.outputSummary || entry.output } : {}),
                    ...(entry ? { attempts: entry.attempts } : {}),
                    ...(this.childByNode.get(resolvedNodeId) ? { childId: this.childByNode.get(resolvedNodeId) } : {}),
                    waitedMs: this.now() - startedAt,
                };
            }
            // 运行已暂停/停止/中断/失败：节点不可能再结算，立即返回当前事实，由父代理决策。
            if (run.snapshot.status !== 'running') {
                return {
                    nodeId: resolvedNodeId,
                    status,
                    runStatus: run.snapshot.status,
                    ...(entry ? { attempts: entry.attempts } : {}),
                    ...(this.childByNode.get(resolvedNodeId) ? { childId: this.childByNode.get(resolvedNodeId) } : {}),
                    waitedMs: this.now() - startedAt,
                };
            }
            if (this.now() >= deadline) {
                return {
                    nodeId: resolvedNodeId,
                    status: 'timeout',
                    runStatus: run.snapshot.status,
                    ...(entry ? { attempts: entry.attempts } : {}),
                    ...(this.childByNode.get(resolvedNodeId) ? { childId: this.childByNode.get(resolvedNodeId) } : {}),
                    waitedMs: this.now() - startedAt,
                };
            }
            await this.sleepUntilNextWaitPoll(callerSignal);
        }
    }
    /** wf_wait_agent 的轮询间隔（250ms；可被调用取消信号中断）。 */
    sleepUntilNextWaitPoll(signal) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                signal?.removeEventListener('abort', onAbort);
                resolve();
            }, 250);
            const onAbort = () => {
                clearTimeout(timer);
                reject(new WfError('WF_CANCELLED: the run has been stopped', 'WF_CANCELLED'));
            };
            if (signal?.aborted)
                onAbort();
            else
                signal?.addEventListener('abort', onAbort, { once: true });
        });
    }
    // ---- wf_resume ------------------------------------------------------------
    /**
     * wf_resume：人工决策后继续暂停/停止/中断的编排（可选回滚到指定节点）。
     *
     * 语义：
     *   - 只允许会话根代理调用；
     *   - 运行中不得续跑（WF_ALREADY_RUNNING），先停止或直接调度节点；
     *   - 优先接管内存中的 paused 条目，其次取该会话磁盘上最近的可恢复记录；
     *   - rollbackToNodeId 给出时，目标节点及其流程下游失效后从目标重跑（见 resume.ts）；
     *   - 静默接续：不注入编排指令，父代理在本回合内继续调度（与工具路径一致）。
     */
    async wfResume(caller, args) {
        if (caller.isChild)
            throw new WfError('WF_NOT_ROOT: a child agent cannot call wf_resume; only the session main agent may resume an orchestration', 'WF_NOT_ROOT');
        const sessionId = caller.sessionId;
        if (!sessionId)
            throw new WfError('WF_BAD_CALLER: cannot identify the caller session', 'WF_BAD_CALLER');
        const rollbackToNodeId = args?.rollbackToNodeId === undefined || args.rollbackToNodeId === null
            ? undefined
            : String(args.rollbackToNodeId).trim() || undefined;
        const reason = args?.reason === undefined || args.reason === null ? undefined : String(args.reason).trim();
        const active = this.activeRunForSession(sessionId);
        if (active) {
            throw new WfError(`WF_ALREADY_RUNNING: run ${active.snapshot.id} is already running; dispatch nodes directly, or stop it before resuming`, 'WF_ALREADY_RUNNING');
        }
        // 候选：内存 paused 优先（SLA 到期已被看护收敛为 stopped 的条目走磁盘）。
        let candidate;
        for (const entry of this.runs.values()) {
            const snapshot = entry.snapshot;
            if (snapshot.sessionId === sessionId && snapshot.status === 'paused') {
                candidate = { flowId: snapshot.flowId, runId: snapshot.id };
                break;
            }
        }
        if (!candidate) {
            const records = (await this.deps.store.listAllRuns())
                .filter((record) => record.sessionId === sessionId && RESUMABLE_STATUSES.includes(record.status))
                .sort((a, b) => (String(a.startedAt ?? '') < String(b.startedAt ?? '') ? 1 : -1));
            const latest = records[0];
            if (!latest)
                throw new WfError('该会话没有可恢复的运行（暂停/中断/停止记录）', 'WF_NO_RESUME_POINT');
            candidate = { flowId: latest.flowId, runId: latest.id };
        }
        const result = await this.resumeRun({
            sessionId,
            flowId: candidate.flowId,
            fromRunId: candidate.runId,
            silent: true,
            ...(rollbackToNodeId === undefined ? {} : { rollbackToNodeId }),
            ...(reason === undefined ? {} : { rollbackReason: reason }),
        });
        return {
            runId: result.runId,
            status: 'running',
            resumedFromRunId: result.resumedFromRunId,
            ...(result.rollbackToNodeId === undefined ? {} : { rollbackToNodeId: result.rollbackToNodeId }),
            ...(result.invalidatedNodeIds === undefined ? {} : { invalidatedNodeIds: result.invalidatedNodeIds }),
        };
    }
    // ---- wf_decide ------------------------------------------------------------
    /**
     * wf_decide：为一条条件分支连线记录「按证据选路」的决策。
     *
     * 为什么需要：平台不自动遍历条件线，分支选择原本只存在于 Leader 的聊天语义里。
     * 本工具把「选了哪条边、依据是什么、对应分支节点哪一回合」落成运行快照事实，
     * 并由 wf_run_node 的分支点门禁校验（contentDecisionGate）。
     */
    async wfDecide(caller, args) {
        if (caller.isChild)
            throw new WfError('WF_NOT_ROOT: a child agent cannot call wf_decide; only the session main agent may record branch decisions', 'WF_NOT_ROOT');
        const sessionId = caller.sessionId;
        if (!sessionId)
            throw new WfError('WF_BAD_CALLER: cannot identify the caller session', 'WF_BAD_CALLER');
        const sourceNodeId = String(args?.sourceNodeId ?? '').trim();
        const targetNodeId = String(args?.targetNodeId ?? '').trim();
        const evidence = String(args?.evidence ?? '').trim();
        const rationale = args?.rationale === undefined || args.rationale === null ? '' : String(args.rationale).trim();
        if (!sourceNodeId || !targetNodeId) {
            throw new WfError('WF_BAD_ARGS: wf_decide requires sourceNodeId and targetNodeId', 'WF_BAD_ARGS');
        }
        if (evidence.length < 3) {
            throw new WfError('WF_BAD_ARGS: wf_decide requires real evidence (file path / command / log / exit code); chat claims are not evidence', 'WF_BAD_ARGS');
        }
        const run = await this.ensureActiveRun(sessionId);
        if (!run)
            throw new WfError('WF_NO_ACTIVE_RUN: no active orchestration in this session', 'WF_NO_ACTIVE_RUN');
        const flow = await this.currentResolvedFlow(run);
        const sourceNode = nodeById(flow, sourceNodeId);
        const targetNode = nodeById(flow, targetNodeId);
        if (!sourceNode || !targetNode) {
            throw new WfError(`WF_DECISION_BAD_TARGET: source/target node not found on the canvas: ${!sourceNode ? sourceNodeId : targetNodeId}`, 'WF_DECISION_BAD_TARGET');
        }
        const line = flow.lines.find((item) => item.source === sourceNodeId && item.target === targetNodeId
            && item.sourceHandle === 'flow-out' && item.condition !== undefined);
        if (!line || line.condition === undefined) {
            throw new WfError(`WF_DECISION_BAD_TARGET: no conditional flow edge ${sourceNodeId} -> ${targetNodeId}; `
                + 'only pass/fail/content branch lines can be decided', 'WF_DECISION_BAD_TARGET');
        }
        const mainSourceId = sourceNode.kind === 'proxy' ? sourceNode.proxySourceId : sourceNode.id;
        const sourceEntry = run.snapshot.nodes.find((entry) => entry.nodeId === mainSourceId);
        const at = new Date(this.now()).toISOString();
        const decision = {
            id: this.deps.uuid?.() ?? `dec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            at,
            sourceNodeId,
            targetNodeId,
            lineId: line.id,
            conditionType: line.condition.type,
            ...(line.condition.label === undefined ? {} : { label: line.condition.label }),
            evidence,
            ...(rationale ? { rationale } : {}),
            ...(sourceEntry?.endedAt ? { sourceTurnEndedAt: sourceEntry.endedAt } : {}),
        };
        run.snapshot.decisions = [...(run.snapshot.decisions ?? []), decision];
        await this.persistWarn(run);
        return {
            decisionId: decision.id,
            runId: run.snapshot.id,
            sourceNodeId,
            targetNodeId,
            lineId: line.id,
            conditionType: line.condition.type,
            ...(line.condition.label === undefined ? {} : { label: line.condition.label }),
            at,
        };
    }
    /**
     * 条件分支决策门禁（wf_run_node 派发前调用）。
     *
     * 判定：目标节点的 **content 条件入边** 中，源节点是「语义分支点」（该源的 content
     * 条件流程出边 ≥ 2 条）的边；若存在这类边，则必须有一条覆盖「分支源最近一回合」的
     * wf_decide 记录。pass/fail 客观门禁不强制决策；简单线性流程不受影响；源节点重跑后
     * 旧决策因回合时间不同自动失效，需要重新决策。
     */
    assertDecisionRecorded(run, flow, targetNodeId) {
        if (this.deps.config.contentDecisionGate === false)
            return;
        // 只门禁 **content（语义判断）** 分支：pass/fail 是客观证据门禁，不要求额外决策记录。
        const candidates = flow.lines.filter((line) => {
            if (line.target !== targetNodeId || line.sourceHandle !== 'flow-out' || line.condition?.type !== 'content')
                return false;
            const contentOutEdges = flow.lines.filter((other) => other.source === line.source && other.sourceHandle === 'flow-out' && other.condition?.type === 'content');
            return contentOutEdges.length >= 2;
        });
        if (candidates.length === 0)
            return;
        // 运行起点误报修复：模板的反馈回环（issue-review / synthesis → stage-spec 等）会让
        // 目标节点在拓扑上「可被分支点到达」，但新 run 第一次派发时这些源节点根本没有执行。
        // 决策门禁只应在「语义分支已实际发生」时要求记录：目标已被执行（回流/重入）或任一
        // 候选源已有执行痕迹；否则初始派发会被未来才会发生的分支误伤（WF_DECISION_REQUIRED）。
        const executed = (nodeId) => {
            const entry = run.snapshot.nodes.find((item) => item.nodeId === nodeId);
            return entry !== undefined && (entry.status !== 'pending' || entry.startedAt !== null);
        };
        const targetStarted = executed(targetNodeId);
        const sourceStarted = candidates.some((line) => {
            const sourceDef = nodeById(flow, line.source);
            const mainSourceId = sourceDef?.kind === 'proxy' ? sourceDef.proxySourceId : line.source;
            return executed(mainSourceId);
        });
        if (!targetStarted && !sourceStarted)
            return;
        const decisions = run.snapshot.decisions ?? [];
        const satisfied = candidates.some((line) => {
            const sourceDef = nodeById(flow, line.source);
            const mainSourceId = sourceDef?.kind === 'proxy' ? sourceDef.proxySourceId : line.source;
            const sourceEntry = run.snapshot.nodes.find((entry) => entry.nodeId === mainSourceId);
            const sourceTurn = sourceEntry?.endedAt ?? '';
            return decisions.some((decision) => decision.lineId === line.id && decision.targetNodeId === targetNodeId
                && (decision.sourceTurnEndedAt ?? '') === sourceTurn);
        });
        if (satisfied)
            return;
        const branches = candidates
            .map((line) => `${line.id}（${line.source} → ${line.target}，${line.condition?.type ?? ''}：${line.condition?.label ?? ''}）`)
            .join('；');
        throw new WfError(`WF_DECISION_REQUIRED: node "${targetNodeId}" can be reached from a branch point, but no wf_decide record `
            + `covers the branch source's latest turn. Record the chosen branch with real evidence first. Candidates: ${branches}`, 'WF_DECISION_REQUIRED', { targetNodeId, candidateLineIds: candidates.map((line) => line.id) });
    }
    // ---- wf_finish ------------------------------------------------------------
    /**
     * wf_finish：父代理收尾信号 → 写完成/失败记录并释放运行锁。幂等。
     * 运行锁降权（用户裁决）：本会话停在 paused/stopped/interrupted 断点时先静默接续接管
     * （只接管运行事实与锁，不注入编排指令），父代理可确认流程已走完后直接收尾，
     * 不再报 WF_NO_ACTIVE_RUN；只有「本会话既无激活运行也无任何可恢复断点」才按旧语义
     * 返回终态幂等/报错。
     */
    async wfFinish(caller, args) {
        if (caller.isChild)
            throw new WfError('WF_NOT_ROOT: a child agent cannot call wf_finish; only the session main agent may close an orchestration', 'WF_NOT_ROOT');
        const sessionId = caller.sessionId;
        const run = sessionId ? await this.ensureActiveRun(sessionId) : null;
        // 执行者模式：wf_finish 同样视为父代理自身任务完成（无后续调度、直接收尾的流程）
        if (run)
            this.markParentExecutorDone(run);
        // 已停止/已完成的幂等：允许对已终止的同会话运行静默返回。
        // 终态条目已从内存释放（防内存膨胀），故幂等判定查磁盘历史（收尾调用频率极低）。
        if (!run) {
            try {
                // 口径（D02-06）：只认「本会话最近一条运行」——旧实现按目录遍历顺序取第一条非
                // running 记录，会把任意一条本会话的旧终态运行当成本次请求的收尾结果（多实例/
                // 多工作流会话下报告错误状态与 runId）。为什么不直接用 listRuns(flowId, sessionId)：
                // wf_finish 的调用方身份只有 sessionId（工具层不携带 flowId），且「本次请求的
                // flowId」在无激活运行时本就无从取得，故在唯一可用的扫描入口上显式过滤 + 倒序取最新。
                // 扫描语义（跳过非本资源文档）：单个坏文件不得让幂等判定整体失效。
                const latest = (await this.deps.store.listAllRuns())
                    .filter((record) => record.sessionId === sessionId)
                    .sort((a, b) => (String(a.startedAt ?? '') < String(b.startedAt ?? '') ? 1 : -1))[0];
                if (latest && latest.status !== 'running') {
                    return { ok: true, runId: latest.id, status: latest.status, idempotent: true };
                }
            }
            catch {
                // 磁盘读失败按无历史处理
            }
            throw new WfError('WF_NO_ACTIVE_RUN: no running orchestration in this session', 'WF_NO_ACTIVE_RUN');
        }
        const snapshot = run.snapshot;
        if (snapshot.status !== 'running')
            return { ok: true, runId: snapshot.id, status: snapshot.status, idempotent: true };
        const isFailed = args?.status === 'failed';
        snapshot.status = isFailed ? 'failed' : 'completed';
        snapshot.summary = String(args?.summary ?? '');
        snapshot.endedAt = this.isoNow();
        terminalizeNodes(snapshot, this.now(), isFailed ? 'fail' : 'completed');
        await this.persistWarn(run);
        // 收尾完成即释放内存条目（终态已持久化；运行锁随状态自然释放）
        this.releaseRunMemory(snapshot.id);
        return { ok: true, runId: snapshot.id, status: snapshot.status };
    }
}
//# sourceMappingURL=runtime-execute.js.map