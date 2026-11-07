import { type DecideArgs, type DecisionResult, type FinishArgs, type FinishResult, type ResumeArgs, type RunNodeArgs, type RunNodeResult, type RunResumeResult, type WaitAgentArgs, type WaitAgentResult } from './run-entry.js';
import { type CallerInfo } from './seams.js';
import { RuntimeLaunch } from './runtime-launch.js';
export declare class RuntimeExecute extends RuntimeLaunch {
    /** 校验调用者为「当前会话根 Agent」并取可直接执行节点的激活运行（必要时静默接续）。 */
    private requireRootRun;
    /**
     * wf_run_node：启动一个角色节点的子代理。
     *   - 默认异步（模式一）：立即返回 { nodeId, status:'started', childId }；
     *   - wait:true 阻塞（模式二）：等待该节点子代理完成，返回 { nodeId, status:'ok'|'fail', childId, output }；
     *   - 暂停节点：触发暂停门（run=paused + 断点持久化 resumeFrom=暂停节点，锁保留）；
     *   - 非人工 paused/stopped/interrupted 断点先静默接续再调度；人工停止需明确恢复。
     */
    wfRunNode(caller: CallerInfo, args: RunNodeArgs, callerSignal?: AbortSignal, options?: {
        expectedMode?: 'mode1' | 'mode2';
    }): Promise<RunNodeResult>;
    /** 通过性校验的循环计数器：按当前活跃 run + guardId 计数，超限后清零。 */
    wfLoopCounter(caller: CallerInfo, args: {
        guardId?: unknown;
        action?: unknown;
        limit?: unknown;
    }): Promise<{
        guardId: string;
        action: 'tick' | 'reset';
        count: number;
        limit: number;
        exceeded: boolean;
        reset: boolean;
    }>;
    /**
     * wf_wait_agent：等待已启动的任意工作流节点结算（普通子代理 / Team 成员均可）。
     *
     * 为什么不复用官方 wait_agent：官方 wait_agent 只观察官方 Team 成员；普通 agent
     * 节点（如 stage-spec）不在 Team roster 中，wait_agent 必然返回 no-active-peer，
     * 父代理只能退化成 bash 轮询。本工具以运行快照为事实源轮询节点状态，补上普通节点
     * 的可观察等待；不启动/不重派节点，只等待。
     */
    wfWaitAgent(caller: CallerInfo, args: WaitAgentArgs, callerSignal?: AbortSignal): Promise<WaitAgentResult>;
    /** wf_wait_agent 的轮询间隔（250ms；可被调用取消信号中断）。 */
    private sleepUntilNextWaitPoll;
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
    wfResume(caller: CallerInfo, args: ResumeArgs): Promise<RunResumeResult>;
    /**
     * wf_decide：为一条条件分支连线记录「按证据选路」的决策。
     *
     * 为什么需要：平台不自动遍历条件线，分支选择原本只存在于 Leader 的聊天语义里。
     * 本工具把「选了哪条边、依据是什么、对应分支节点哪一回合」落成运行快照事实，
     * 并由 wf_run_node 的分支点门禁校验（contentDecisionGate）。
     */
    wfDecide(caller: CallerInfo, args: DecideArgs): Promise<DecisionResult>;
    /**
     * 条件分支决策门禁（wf_run_node 派发前调用）。
     *
     * 判定：目标节点的 **content 条件入边** 中，源节点是「语义分支点」（该源的 content
     * 条件流程出边 ≥ 2 条）的边；若存在这类边，则必须有一条覆盖「分支源最近一回合」的
     * wf_decide 记录。pass/fail 客观门禁不强制决策；简单线性流程不受影响；源节点重跑后
     * 旧决策因回合时间不同自动失效，需要重新决策。
     */
    private assertDecisionRecorded;
    /**
     * wf_finish：父代理收尾信号 → 写完成/失败记录并释放运行锁。幂等。
     * 运行锁降权（用户裁决）：本会话停在 paused/stopped/interrupted 断点时先静默接续接管
     * （只接管运行事实与锁，不注入编排指令），父代理可确认流程已走完后直接收尾，
     * 不再报 WF_NO_ACTIVE_RUN；只有「本会话既无激活运行也无任何可恢复断点」才按旧语义
     * 返回终态幂等/报错。
     */
    wfFinish(caller: CallerInfo, args: FinishArgs): Promise<FinishResult>;
}
