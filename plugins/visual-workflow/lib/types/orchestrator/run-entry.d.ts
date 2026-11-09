import type { FlowStore } from '../storage/flow-store.js';
import type { RoleNode, WorkflowDocument } from '../shared/graph-model.js';
import type { NodeRunStatus } from '../shared/run-types.js';
import type { RunSnapshot, RunStatus } from '../shared/types.js';
import type { AgentHost, NodeRunner, OrchestratorConfig, OrchestratorLogger, ParentModelSelectionLike, ParentPromptSetupLike } from './seams.js';
/** 单次运行的内存条目（旧项目 entry 同构：快照 + 护栏计数 + in-flight 表）。 */
export interface RunEntry {
    /** 运行级取消控制器（停止/终止/插件卸载时 abort；阻塞中的 wait/提问随之取消）。 */
    controller: AbortController;
    /** 运行快照（状态机事实源；持久化副本经 store.saveRun）。 */
    snapshot: RunSnapshot;
    /** 起始工作流（currentResolvedFlow 读失败时的回退）。 */
    baseFlow: WorkflowDocument;
    /** 运行中的子代理 childId 集合（空闲看护据此不判空闲）。 */
    inflight: Set<string>;
    /**
     * nodeId → **当前任务**连续失败尝试次数（回流重试硬护栏）。
     *
     * 语义：一次任务成功结算后，下一次派发属于新任务，失败计数从 0 重新累计；
     * 因此 retryLimit 是「每个任务的重试预算」，而不是节点生命周期内的总失败次数。
     * 这样模块队列里的同一 RTL/验证工程师处理多个模块时，不会被前面模块的偶发失败
     * 消耗掉后续模块的预算。
     */
    attempts: Map<string, number>;
    /**
     * 正在启动中（已通过护栏、startNodeTask 尚未返回）的节点 id。
     * 用于异步派发的并发窗口去重：同一节点的两次快速 wf_run_node 只允许启动一个子代理。
     */
    dispatching: Set<string>;
    /** wf_run_node 总调用数（全局硬护栏）。 */
    callCount: number;
    /** 通过性校验循环计数：guardId → 当前循环次数（run 内存储，超限清零）。 */
    loopCounters: Map<string, number>;
    /** 最近活动时间戳（空闲看护基准）。 */
    lastActiveAt: number;
    /** 阻塞等待表：`${runId}:${nodeId}` → waiter（wait:true 路径）。 */
    waiters: Map<string, Waiter>;
    /**
     * 执行者模式：父代理节点 id（父代理被流程线连接，作为执行单元先执行自身任务）。
     * 启动时登记；父代理开始调度（首次 wf_run_node/wf_finish）时把该节点标记 ok。
     */
    executorParentId?: string;
    /**
     * 上次同步给编排的拓扑基线（画布保存后的「编排语义是否变更」判定用）。
     *
     * 为什么是内存事实：它只在本次运行期内有意义（重启后 run 转 interrupted，不再有保存
     * 触发的变更判定），且拓扑取数已改为 currentResolvedFlow 显式重读最新实例文档——
     * 曾经的 orchestrations/<runId>.json 落盘副本因此失去唯一消费者（该副本当初只为给
     * 父代理 read 一份只读快照）。startRun/resumeRun 以起始 flow 初始化。
     */
    lastSyncedFlow?: WorkflowDocument;
}
/** wait:true 的阻塞等待器（subagent/end 唤醒 resolve；终止/取消 reject）。 */
export interface Waiter {
    promise: Promise<RunNodeResult>;
    resolve: (result: RunNodeResult) => void;
    reject: (error: unknown) => void;
}
/** 创建挂起等待器（resolve/reject 闭合到 promise）。 */
export declare function createWaiter(): Waiter;
/** wf_run_node 入参（工具参数经 schema 校验后传入；未知字段宽松处理）。 */
export interface RunNodeArgs {
    nodeId?: unknown;
    wait?: unknown;
    thinking?: unknown;
    iterationLimit?: unknown;
    retryLimit?: unknown;
}
/** wf_run_node 返回（三条路径：started 异步 / paused 暂停门 / ok|fail wait 阻塞）。 */
export interface RunNodeResult {
    nodeId: string;
    status: 'started' | 'paused' | 'ok' | 'fail';
    childId?: string;
    output?: string;
    /**
     * 本次派发属于该节点的第几次任务尝试（按当前任务计数；成功后的新任务从 1 重新开始）。
     * 仅 started 路径提供，供父代理在汇报/决策时展示重试消耗。
     */
    attempt?: number;
    /** 该节点当前生效的重试上限（retryLimit；首次执行之外还可再试的次数）。 */
    retryLimit?: number;
    /** 本次派发后该任务剩余的重试次数（达到 0 后下一次失败重试将被 WF_RETRY_LIMIT 拒绝）。 */
    remainingRetries?: number;
    /**
     * 去重标记：本次调用命中了「启动窗口」——该节点正在 startNodeTask 中，
     * 没有启动第二个子代理；childId 在极短窗口内可能尚未登记。
     */
    deduplicated?: boolean;
    /** 暂停门 SLA 截止时间（ISO；仅 paused 路径且配置了 pauseSlaMs 时出现）。 */
    pauseDeadlineAt?: string;
}
/** wf_wait_agent 入参：等待已启动的工作流节点结算（不启动新节点）。 */
export interface WaitAgentArgs {
    nodeId?: unknown;
    /** 最长等待毫秒数；默认 300000，范围 1000..3600000。 */
    timeoutMs?: unknown;
}
/** wf_wait_agent 返回：节点状态 / 运行状态 / 耗时与产出摘要。 */
export interface WaitAgentResult {
    nodeId: string;
    status: NodeRunStatus | 'timeout';
    /** 运行级状态（等待期间可能暂停/停止/中断）。 */
    runStatus?: RunSnapshot['status'];
    /** 节点最终产出摘要（ok / react-capped）。 */
    output?: string;
    attempts?: number;
    childId?: string;
    /** A new user prompt arrived while waiting; the agent should process it before scheduling further nodes. */
    interruptedByUserInput?: boolean;
    /** No live subagent can settle this node; the parent should inspect or dispatch it. */
    interruptedByNoActiveAgent?: boolean;
    /** Human-readable reason for the no-active-agent interruption. */
    interruptMessage?: string;
    waitedMs: number;
}
/** wf_resume 入参（人工决策后继续暂停/停止的编排；可选回滚）。 */
export interface ResumeArgs {
    /**
     * 回滚目标节点 id（可选）：放弃该节点及其流程下游的旧产出，从该节点重新执行。
     * 目标必须是画布上存在的角色节点（agent/parent；proxy 解析到主节点）。
     */
    rollbackToNodeId?: unknown;
    /** 回滚/继续原因（写入快照 rollback 事实，供审计与汇报）。 */
    reason?: unknown;
}
/** wf_resume 返回（续跑已接管，父代理从 resumeFromNodeId 继续调度）。 */
export interface RunResumeResult {
    runId: string;
    status: 'running';
    /** 实际恢复的旧 run id。 */
    resumedFromRunId: string;
    /** 本次回滚到的节点 id（仅回滚时出现）。 */
    rollbackToNodeId?: string;
    /** 回滚失效（重置为 pending）的节点 id 清单（仅回滚时出现）。 */
    invalidatedNodeIds?: string[];
}
/** wf_decide 入参：为一条条件分支连线记录「按证据选路」的决策。 */
export interface DecideArgs {
    /** 分支出发节点 id（画布节点 id）。 */
    sourceNodeId?: unknown;
    /** 目标节点 id（画布节点 id）。 */
    targetNodeId?: unknown;
    /** 决策依据（真实文件/命令/日志证据；必须非空）。 */
    evidence?: unknown;
    /** 决策理由/结论（可选）。 */
    rationale?: unknown;
}
/** wf_decide 返回（决策已写入运行快照）。 */
export interface DecisionResult {
    decisionId: string;
    runId: string;
    sourceNodeId: string;
    targetNodeId: string;
    lineId: string;
    conditionType: 'pass' | 'fail' | 'content';
    label?: string;
    at: string;
}
/** 官方 subagent/end 观察 payload（全字段可选，运行时守卫）。 */
export interface SubagentEndInfo {
    runId?: unknown;
    provider?: unknown;
    id?: unknown;
    local?: unknown;
    stopReason?: unknown;
    lastAssistantMessage?: unknown;
}
/** 编排器全部依赖（单测 fake / index.ts 真实适配）。 */
export interface OrchestratorDeps {
    /** 数据层（FlowStore）。 */
    store: FlowStore;
    /** 节点子代理执行引擎（单测 fake）。 */
    runner: NodeRunner;
    /** 父代理宿主能力（index.ts 的 CordisAgentHost；单测 fake）。 */
    agents: AgentHost;
    /** 子代理/父代理提示词注入装配（角色 Prompt 段 + 官方系统提示词开关；缺省跳过父代理绑定）。 */
    promptSetup?: ParentPromptSetupLike;
    /** 模型选择装配（父代理模型/思考强度注入；缺省跳过父代理绑定）。 */
    modelSelection?: ParentModelSelectionLike;
    /**
     * 父代理角色 Prompt 读取能力（宿主注入：agent 层实现，含 .md 路径设置时的文件读取）。
     * 为什么经缝注入：读角色 Prompt 文件属 agent 关注点，编排器只做「注入到根 Agent ctx」。
     */
    resolveRolePrompt?: (node: RoleNode) => Promise<string>;
    /** 配置子集。 */
    config: OrchestratorConfig;
    /**
     * 运行期数据库索引预建能力（宿主注入；缺省跳过预建，交由 wf_db_query(mode=search)
     * 的惰性构建兜底）。用于在启动节点子代理之前为其 db-in 所连库预建索引，
     * 吸收构建耗时、避免子代理首次检索才构建。
     * 为什么注入能力而非具体实现：具体索引服务属数据工具域，编排器不反向依赖 tools。
     */
    dbIndexer?: {
        ensureIndexes(nodeId: string, flow: WorkflowDocument): Promise<void>;
    };
    /** 系统语言名读取（宿主注入：从 DSH 用户设置读取；缺省回退默认语言）。 */
    systemLanguage?: () => string;
    /** 日志（缺省 console）。 */
    logger?: OrchestratorLogger;
    /** 时钟注入（单测可控；缺省 Date.now）。 */
    now?: () => number;
    /** runId 生成注入（缺省 run-<base36 时间戳>-<随机段>）。 */
    newRunId?: () => string;
    /** 消息 id 生成注入（缺省 randomUUID）。 */
    uuid?: () => string;
}
export interface StartRunOptions {
    /** 已解析的 UI 语言；无 GUI 的调用方缺省时使用 Host 设置。 */
    systemLanguage?: string;
    /** 运行模式（缺省 mode1；模式二由服务管理器传入 mode2）。 */
    mode?: 'mode1' | 'mode2';
    /** 模式二：本次外部请求的用户问题（注入输入节点产出 + 编排指令动态段）。 */
    question?: string;
}
export interface StartRunResult {
    runId: string;
    /** 实际执行会话 id（工作台全局化改版：恒等于入参 sessionId——运行只认实例绑定的会话）。 */
    sessionId: string;
}
export interface FinishArgs {
    status?: unknown;
    summary?: unknown;
}
export interface FinishResult {
    ok: true;
    runId: string;
    status: RunStatus;
    /** 已终止运行的幂等收尾标记。 */
    idempotent?: boolean;
}
export interface TerminateOptions {
    status: 'stopped' | 'failed';
    summary: string;
    abortReason?: string;
}
