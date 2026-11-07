import type { FlowStore } from '../storage/flow-store.js';
import type { WorkflowDocument } from '../shared/graph-model.js';
import type { RunSnapshot } from '../shared/types.js';
/**
 * 可恢复的 run 状态集合：
 *   paused=暂停门/窗口挂起断点；interrupted=宿主重启中断；stopped=用户停止（可续跑修正）。
 * 导出供运行时断点定位复用（runtime-base.ensureActiveRun 的磁盘兜底扫描与静默接续），
 * 避免两处各自维护一份可恢复状态清单而产生漂移。
 */
export declare const RESUMABLE_STATUSES: readonly ["paused", "interrupted", "stopped", "failed"];
/** 断点续跑入参（工具路径静默接续与端点/调度器显式续跑共用）。 */
export interface ResumeInput {
    /** 续跑时显式指定的 UI 语言；缺省继承断点快照的语言。 */
    systemLanguage?: string;
    sessionId: string;
    flowId: string;
    /** 指定恢复的旧 run id；缺省取该工作流最近的可恢复记录。 */
    fromRunId?: string;
    /**
     * 静默接续（工具路径专用）：跳过向父代理注入编排指令的唤醒动作。
     * 为什么需要：父代理调用 wf_* 工具时正处于自身回合内（root 忙碌），而「注入编排指令
     * 唤醒父代理」要求父代理空闲让位——工具路径本就由父代理自行调度，不需要也不应再
     * 注入一份编排指令。缺省 false：工作台「运行/恢复」、调度器与模式二服务等显式启动
     * 语义仍按原样注入编排指令唤醒父代理。
     */
    silent?: boolean;
    /**
     * 回滚目标节点 id（可选）：续跑时放弃该节点及其流程下游的旧产出，从该节点重新执行。
     * 目标必须是画布上存在的角色节点（agent/parent；proxy 会解析到主节点）；
     * 未被目标覆盖的已完成分支保持继承，不整体重跑。
     */
    rollbackToNodeId?: string;
    /** 回滚原因（写入新快照 rollback 事实，供审计与汇报）。 */
    rollbackReason?: string;
}
/** 断点续跑结果。 */
export interface ResumeResult {
    runId: string;
    /** 实际恢复的旧 run id。 */
    resumedFromRunId: string;
    /** 本次续跑回滚到的节点 id（未回滚时缺省）。 */
    rollbackToNodeId?: string;
    /** 回滚失效（重置为 pending）的节点 id 清单（未回滚时缺省）。 */
    invalidatedNodeIds?: string[];
}
/**
 * 查找可恢复的 run：
 *   - fromRunId 指定：磁盘记录必须存在且归属会话/工作流匹配且状态可恢复；
 *   - 未指定：该工作流上次运行可恢复时返回该记录；已完成后不回退旧断点。
 * 查无返回 null（由调用方区分「无断点」与「指定 run 不可恢复」两类语义）。
 */
export declare function findResumableRun(store: FlowStore, input: ResumeInput): Promise<RunSnapshot | null>;
/**
 * 构建继承快照（纯函数）：
 *   - 节点清单以「当前工作流」为准（恢复前画布可能已编辑）；
 *   - 旧 run 中 ok/react-capped 的节点继承状态、完整输出与摘要（resumed=true）；
 *   - 其余节点回退 pending（attempts/时间戳/输出清零），恢复后重新执行；
 *   - 断点字段：resumedFromRunId 追溯链、resumeFromNodeId 续跑起点。
 */
export declare function buildResumedSnapshot(input: {
    prev: RunSnapshot;
    runId: string;
    flow: WorkflowDocument;
    sessionId: string;
    mode: 'mode1' | 'mode2';
    now?: number;
}): RunSnapshot;
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
export declare function rollbackFromNode(input: {
    snapshot: RunSnapshot;
    flow: WorkflowDocument;
    targetNodeId: string;
    reason?: string;
    now?: number;
}): string[];
