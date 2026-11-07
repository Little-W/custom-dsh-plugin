// src/host/prompts/texts/notice-checkpoint-resume.ts
// 适用：显式恢复 Workflow；注入位置：父代理内部 notice，Chat 默认仅显示摘要。
// 变量：runId / resumedFromRunId / resumeFromNodeId / mode1 / mode2。
export const NOTICE_CHECKPOINT_RESUME = `【断点恢复】
runId={{runId}}
resumedFromRunId={{resumedFromRunId}}
resumeFromNodeId={{resumeFromNodeId}}

已继承检查点中的节点状态与已完成产出。先调用 wf_org_catalog(ids:["instance"]) 读取当前运行快照，继续未完成的工作，不要重跑已完成节点或重新开始流程。同一工程师承接新的模块任务仍可正常派工；不要把已完成的旧任务再次派发。
对于中断中的任务，先核对实际文件、工具结果与任务计划，再继续或重试，避免重复副作用。这里恢复的是工作流检查点，不是被中断工具或模型输出的逐字续传。
{{#if mode1}}使用 wf_run_node 异步调度待执行节点。{{/if}}{{#if mode2}}使用 wf_run_node_wait 调度待执行节点并等待完成。{{/if}}`;
export const CHECKPOINT_RESUME_SUMMARY = '已从检查点继续';
//# sourceMappingURL=notice-checkpoint-resume.js.map