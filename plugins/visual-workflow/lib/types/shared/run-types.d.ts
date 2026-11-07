import type { OrgMeta } from './org-meta.js';
/** run 运行状态：运行/暂停/完成/失败/停止/中断（架构文档 §4.3 状态机 + §6.1）。 */
export type RunStatus = 'running' | 'paused' | 'completed' | 'failed' | 'stopped' | 'interrupted';
/** 单节点运行状态（架构文档 §6.1 nodes[].status）。 */
export type NodeRunStatus = 'pending' | 'running' | 'armed' | 'ok' | 'fail' | 'skipped' | 'react-capped';
/**
 * 运行快照：一次 run 的完整持久化状态（架构文档 §6.1 逐字段）。
 * 断点续跑：每次续跑生成一条新 run 记录，节点快照=全量节点，已 ok 节点状态继承
 * 自旧 run 并标记来源，经 resumedFromRunId 追溯继承链（需求文档 §4.7 规则 2）。
 */
export interface RunSnapshot {
    /** 本次运行冻结的语言；旧快照缺失时回退 Host 设置。 */
    systemLanguage?: string;
    /** run 稳定标识（runId）。 */
    id: string;
    /** 关联工作流 id（flowId）。 */
    flowId: string;
    /** 工作流名称（历史面板展示用）。 */
    flowName: string;
    /** 归属会话 id。 */
    sessionId: string;
    /** 运行模式（mode1 编排执行 / mode2 后台服务）。 */
    mode: 'mode1' | 'mode2';
    /** 运行状态。 */
    status: RunStatus;
    /** 开始时间（ISO 字符串）。 */
    startedAt: string;
    /** 结束时间（ISO 字符串，未结束时为 null）。 */
    endedAt: string | null;
    /** 运行摘要文本（最终汇总/失败原因提示）。 */
    summary: string;
    /** An explicit user stop must not be revived by a late tool call or child settlement. */
    requiresExplicitResume?: boolean;
    /** 断点续跑：继承的旧 run id（新 run 记录继承链，需求文档 §4.7 规则 2）。 */
    resumedFromRunId?: string;
    /** 断点续跑：从哪个节点恢复（暂停节点 id，需求文档 §4.7 规则 3）。 */
    resumeFromNodeId?: string;
    /**
     * 暂停门进入时间（ISO 字符串；仅 paused 快照有值）。
     * 暂停 SLA 的计时起点；续跑生成的新快照不继承（新一轮暂停重新计时）。
     */
    pausedAt?: string;
    /**
     * 暂停门 SLA 截止时间（ISO 字符串；仅配置 pauseSlaMs > 0 时写入）。
     * 看护扫描到截止时间后按配置把暂停运行收敛为 stopped（保留可恢复断点）。
     */
    pauseDeadlineAt?: string;
    /**
     * 条件分支决策记录（wf_decide 写入；按发生顺序追加）。
     * 用于把「Leader 按证据选路」从纯聊天语义变成可审计事实：分支出发节点在每回合
     * 产出后必须有一次覆盖该回合的决策，wf_run_node 据此做派发门禁。
     */
    decisions?: Array<{
        /** 决策唯一 id。 */
        id: string;
        /** 决策时间（ISO 字符串）。 */
        at: string;
        /** 分支出发节点 id（画布节点 id）。 */
        sourceNodeId: string;
        /** 目标节点 id（画布节点 id）。 */
        targetNodeId: string;
        /** 被选择的流程连线 id。 */
        lineId: string;
        /** 连线条件类型。 */
        conditionType: 'pass' | 'fail' | 'content';
        /** 连线标签（条件语义说明）。 */
        label?: string;
        /** 决策依据（真实文件/命令/证据路径；必须非空）。 */
        evidence: string;
        /** 决策理由/结论（可选）。 */
        rationale?: string;
        /** 决策时分支出发节点最近一回合的结束时间（ISO；续跑/重跑后旧决策自动失效的判据）。 */
        sourceTurnEndedAt?: string;
    }>;
    /**
     * 回滚事实：本次续跑放弃目标节点及其流程下游的旧产出，并从目标节点重新执行。
     * 旧 run 记录保持原状；本字段只描述新 run 从哪里回滚、失效了哪些节点。
     */
    rollback?: {
        /** 回滚目标节点 id（画布节点 id，可能是虚拟节点）。 */
        fromNodeId: string;
        /** 回滚原因（人工/Leader 给出的可行动说明）。 */
        reason?: string;
        /** 回滚发生时间（ISO 字符串）。 */
        at: string;
        /** 被重置为 pending 的节点 id 清单（目标节点及其流程下游）。 */
        invalidatedNodeIds: string[];
    };
    /**
     * 元参数冻结副本（D-13）：startRun 时把「有效元参数（模板 ← 实例覆盖）」的副本
     * 写入快照，供审计与后续评估/重组还原当时预算；续跑继承旧快照的冻结值（不重读）。
     * 未配置元参数时不写（保持既有快照形状，旧数据兼容）。
     */
    meta?: OrgMeta;
    /** 节点执行记录列表（仅可执行 agent 节点；Team/阶段/文件/数据库不做执行记录）。 */
    nodes: Array<{
        /** 节点 id。 */
        nodeId: string;
        /** 该节点当前执行状态。 */
        status: NodeRunStatus;
        /** 尝试次数（回流重试计数，需求文档 §4.2.3.2 规则 3）。 */
        attempts: number;
        /** 节点开始时间（ISO 字符串或 null）。 */
        startedAt: string | null;
        /** 节点最近结束时间（ISO 字符串或 null；随回合刷新，P0-2）。 */
        endedAt: string | null;
        /** 节点完整输出（默认上限 100KB，用于断点/上下文传递，需求文档 §4.7 规则 7）。 */
        output: string;
        /** 输出摘要（显示截断，默认 6000 字，需求文档 §4.7 规则 7）。 */
        outputSummary: string;
        /** 是否继承自旧 run（断点恢复，已 ok 节点不重跑，需求文档 §4.7 规则 6）。 */
        resumed?: boolean;
        /** 最近一次回合的终止原因（stop/interrupt/fail/react-capped/completed；用于父代理区分用户停止与异常失败，P2-5）。 */
        stopReason?: string;
        /** 回合明细（可续跑节点每次被唤醒执行为一回合；P0-2）。 */
        turns?: Array<{
            /** 回合开始时间。 */
            startedAt: string | null;
            /** 回合结束时间。 */
            endedAt: string | null;
            /** 回合终止原因。 */
            stopReason?: string;
            /** 回合输出摘要。 */
            outputSummary: string;
        }>;
    }>;
}
/**
 * 节点输出记录：运行快照中单节点产出的独立视图，供断点续跑回填上游产出
 * （需求文档 §4.7 规则 6：已 ok 节点完整输出随断点重新可用，作为下游节点的自动注入来源）。
 * 与 RunSnapshot.nodes[i] 同源，抽取为独立接口便于 resume 任务（T-027）复用。
 */
export interface NodeOutputRecord {
    /** 节点 id。 */
    nodeId: string;
    /** 节点执行状态（回填仅在 ok / react-capped 时注入产出）。 */
    status: NodeRunStatus;
    /** 尝试次数。 */
    attempts: number;
    /** 节点开始时间（ISO 字符串或 null）。 */
    startedAt: string | null;
    /** 节点结束时间（ISO 字符串或 null）。 */
    endedAt: string | null;
    /** 节点完整输出（用于断点回填/上下文传递）。 */
    output: string;
    /** 输出摘要（界面展示截断）。 */
    outputSummary: string;
    /** 是否继承自旧 run。 */
    resumed?: boolean;
}
