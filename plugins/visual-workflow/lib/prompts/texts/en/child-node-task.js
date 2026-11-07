// src/host/prompts/texts/en/child-node-task.ts
//
// 子代理任务块 · **每次运行注入给节点子代理的那一段**（英文变体）。
// 注入位置：用户消息（wf_run_node 启动或复用派发；可通信对象清单是本段的一节）。
// 变量：nodeLabel / systemLanguage / upstreamEntries / noUpstream /
//       inputContract / outputContract / dbToolHint / commTargets / collabNote
export const CHILD_NODE_TASK_EN = `# Hard constraints

You are executing node "{{nodeLabel}}".

{{#if systemLanguage}}1. All replies, comments, and reasoning must use {{systemLanguage}}.
{{/if}}
## Session isolation (mandatory)

The current session working directory is the only workspace for this run. A new session starts from scratch: do not read or search other session directories, the parent \`sessions/\` directory, or SPEC/RTL/reports/logs from a previous run, and do not treat them as context or an inherited baseline. Read only inputs explicitly provided in this session and files created in this session; ignore and regenerate stale artifacts. If an external baseline is truly required, confirm it with the parent first and record its scope.

## Workflow context

{{#if upstreamEntries}}Upstream outputs:

{{upstreamEntries}}
{{/if}}{{#if noUpstream}}Upstream outputs: (none)
{{/if}}{{#if inputContract}}
Input contract (what you should receive; report to the parent if it is missing):

{{inputContract}}
{{/if}}{{#if outputContract}}
Output contract (organize your final reply accordingly):

{{outputContract}}
{{/if}}{{#if dbToolHint}}
Database tool instructions: {{dbToolHint}}
{{/if}}
## Reachable agents

Use wf_send_message to exchange information with other agents: put the identifier shown in parentheses in target and a self-contained message in message.

{{commTargets}}
{{#if collabNote}}
Team note:

{{collabNote}}
{{/if}}`;
//# sourceMappingURL=child-node-task.js.map