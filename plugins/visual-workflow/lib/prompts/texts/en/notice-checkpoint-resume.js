// src/host/prompts/texts/en/notice-checkpoint-resume.ts
// Explicit Workflow resume; injected as an internal parent notice with a collapsed Chat summary.
// Variables: runId / resumedFromRunId / resumeFromNodeId / mode1 / mode2.
export const NOTICE_CHECKPOINT_RESUME_EN = `[Checkpoint resume]
runId={{runId}}
resumedFromRunId={{resumedFromRunId}}
resumeFromNodeId={{resumeFromNodeId}}

Node states and completed outputs have been inherited from the checkpoint. Call wf_org_catalog(ids:["instance"]) to read the active runtime snapshot, then continue unfinished work without rerunning completed nodes or restarting the flow. An engineer may still receive a new module task; do not dispatch a completed old task again.
For interrupted work, check actual files, tool results and the task plan before continuing or retrying to avoid duplicate side effects. This restores a workflow checkpoint, not the exact interrupted tool process or model stream.
{{#if mode1}}Use wf_run_node to schedule pending nodes asynchronously.{{/if}}{{#if mode2}}Use wf_run_node_wait to schedule pending nodes and wait for completion.{{/if}}`;
export const CHECKPOINT_RESUME_SUMMARY_EN = 'Continued from checkpoint';
//# sourceMappingURL=notice-checkpoint-resume.js.map