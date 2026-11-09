// src/host/knowledge/tool.js
//
// wf_knowledge_capture / wf_knowledge_recall 的工具注册与模型可见契约。
//
// 职责边界：本文件只做「参数 schema → 领域服务 → 稳定输出」的适配；知识校验、
// 合并、检索与落盘全部在 knowledge/service.js。工具之间互不调用。
//
// 提示词规范：description 用官方标准英文，回答「何时调用 / 调用前需要什么 /
// 失败时会发生什么 / 是否产生副作用」，并给出字段预算作为生成引导。
import { DEFAULT_RECALL_LIMIT, KNOWLEDGE_KINDS, LESSON_SEVERITIES, MAX_LESSON_CONTEXT, MAX_LESSON_OPTIMIZATION, MAX_LESSON_PROBLEM, MAX_LESSON_RESOLUTION, MAX_LESSON_ROOT_CAUSE, MAX_READ_IDS, MAX_RECALL_LIMIT, MAX_SKILL_CONTENT, MAX_SKILL_DESCRIPTION, MAX_SKILL_NAME, MAX_SKILL_WHEN_TO_USE, MAX_SOURCE, MAX_TAGS, WF_KNOWLEDGE_CAPTURE, WF_KNOWLEDGE_RECALL, } from './constants.js';
import { defineTool } from '../tools/infrastructure/define-tool.js';
import { registerTool, requireToolsService } from '../tools/infrastructure/register-tool.js';
import { textRender } from '../tools/infrastructure/text-render.js';
/**
 * 注册 wf_knowledge_capture（全局层；ctx.tools.register）。
 * 返回 disposer：注销失败尽力而为。
 */
export function registerWfKnowledgeCapture(ctx, service) {
    const tools = requireToolsService(ctx, WF_KNOWLEDGE_CAPTURE);
    const definition = defineTool({
        name: WF_KNOWLEDGE_CAPTURE,
        description: 'Accumulate durable knowledge while building or running a workflow. Two kinds: '
            + 'kind="workflow_skill" stores a proven reusable capability (node topology, prompt pattern, tool combo, or handoff convention) as a real DSH skill; it requires name, description and content, and accepts optional whenToUse, tags, source and overwrite. The name is normalized to lower kebab-case and automatically prefixed with "wf-"; the skill is written to $DSH_HOME/skills/<name>/SKILL.md and registered as a runtime skill when the skills service is available. An existing SKILL.md that this tool did not create is protected: the call fails with WF_KNOWLEDGE_CONFLICT unless you explicitly pass overwrite:true after reviewing it. '
            + 'kind="error_lesson" stores a problem that was diagnosed and fixed; it requires problem, rootCause and resolution, and accepts optional optimization, context, severity, tags and source. The id is deterministic from problem+rootCause, so capturing the same problem again merges into the same entry and increments occurrences instead of creating a duplicate. '
            + 'Preconditions: capture only reusable, verified knowledge. Never store secrets, personal data, one-off logs, or unverified guesses. A workflow_skill should answer "how to build or operate this kind of workflow again"; an error_lesson should answer "what went wrong, why, and how to prevent it next time". '
            + 'Failure semantics: missing or malformed fields fail with WF_KNOWLEDGE_BAD_ARGS; over-budget fields fail with WF_KNOWLEDGE_VALIDATION (nothing is silently truncated); an untracked name collision fails with WF_KNOWLEDGE_CONFLICT; filesystem failures fail with WF_KNOWLEDGE_IO. '
            + 'Side effects: a successful call writes files under $DSH_HOME (skills) and the plugin data directory (knowledge index and lessons), and may update a runtime skill registration. Repeated lessons are merged, not appended as new files.',
        parameters: {
            kind: {
                type: 'string',
                required: true,
                enum: [...KNOWLEDGE_KINDS],
                description: 'Knowledge type to capture: "workflow_skill" for a reusable workflow-building capability, or "error_lesson" for a diagnosed and fixed problem.',
            },
            // ── workflow_skill ────────────────────────────────────────────
            name: {
                type: 'string',
                description: `Only for workflow_skill. Capability name; normalized to lower kebab-case and prefixed with "wf-" automatically. Aim for at most ${MAX_SKILL_NAME} characters including the prefix.`,
            },
            description: {
                type: 'string',
                description: `Only for workflow_skill. One-sentence description used by skill discovery. Aim for at most ${MAX_SKILL_DESCRIPTION} characters.`,
            },
            whenToUse: {
                type: 'string',
                description: `Only for workflow_skill. Recognizable future signals that should make an agent load this skill. Aim for at most ${MAX_SKILL_WHEN_TO_USE} characters.`,
            },
            content: {
                type: 'string',
                description: `Only for workflow_skill. Full Markdown body: applicable situation, steps, acceptance criteria, counterexamples and cautions. Aim for at most ${MAX_SKILL_CONTENT} characters.`,
            },
            // ── error_lesson ──────────────────────────────────────────────
            problem: {
                type: 'string',
                description: `Only for error_lesson. The observable symptom or failure. Aim for at most ${MAX_LESSON_PROBLEM} characters.`,
            },
            rootCause: {
                type: 'string',
                description: `Only for error_lesson. The verified root cause, not a guess. Aim for at most ${MAX_LESSON_ROOT_CAUSE} characters.`,
            },
            resolution: {
                type: 'string',
                description: `Only for error_lesson. The concrete fix that was applied and verified. Aim for at most ${MAX_LESSON_RESOLUTION} characters.`,
            },
            optimization: {
                type: 'string',
                description: `Only for error_lesson. The forward-looking optimization direction that prevents recurrence. Aim for at most ${MAX_LESSON_OPTIMIZATION} characters.`,
            },
            context: {
                type: 'string',
                description: `Only for error_lesson. The workflow/module/stack context needed to judge whether the lesson applies. Aim for at most ${MAX_LESSON_CONTEXT} characters.`,
            },
            severity: {
                type: 'string',
                enum: [...LESSON_SEVERITIES],
                description: 'Only for error_lesson. Impact level; defaults to "medium" when omitted.',
            },
            // ── shared ────────────────────────────────────────────────────
            tags: {
                type: 'array',
                items: { type: 'string', description: 'A short retrieval tag.' },
                description: `Optional retrieval tags shared by both kinds. At most ${MAX_TAGS} tags; at most 64 characters each; duplicates are removed.`,
            },
            source: {
                type: 'string',
                description: `Optional provenance: the workflow name or module where the knowledge was learned. Aim for at most ${MAX_SOURCE} characters.`,
            },
            overwrite: {
                type: 'boolean',
                description: 'Only for workflow_skill. Set true to replace an existing SKILL.md that this tool did not create. Without it, such a collision fails with WF_KNOWLEDGE_CONFLICT.',
            },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                description: 'kind="workflow_skill": id/name/created/updated/overwroteUntracked/occurrences/path/skillsRoot/runtimeRegistered. kind="error_lesson": id/created/merged/occurrences/severity/path.',
            },
            render: textRender,
        },
        async execute(args) {
            return service.capture(args ?? {});
        },
    });
    return registerTool(tools, definition);
}
/**
 * 注册 wf_knowledge_recall（全局层；ctx.tools.register）。
 * 返回 disposer：注销失败尽力而为。
 */
export function registerWfKnowledgeRecall(ctx, service) {
    const tools = requireToolsService(ctx, WF_KNOWLEDGE_RECALL);
    const definition = defineTool({
        name: WF_KNOWLEDGE_RECALL,
        description: 'Read the workflow knowledge base and its self-iteration protocol. '
            + 'action="guide" returns the library overview, generated workflow-skill names, recent error lessons, and the step-by-step accumulation/self-iteration protocol; call it before planning or editing a workflow and again before finishing a round. '
            + 'action="recall" returns summary hits scored by lexical BM25 (Latin words plus CJK bigrams); query is optional (omit it to list recent entries), kind optionally filters to workflow_skill or error_lesson, and limit is capped at ' + MAX_RECALL_LIMIT + '. '
            + 'action="read" returns full entries by ids: generated skills by their name (with or without the wf- prefix) and error lessons by their lesson-* id; at most ' + MAX_READ_IDS + ' ids per call. '
            + 'Preconditions: use recall before read; only read full entries whose summaries look relevant, so context is not flooded. '
            + 'Failure semantics: a missing or unknown action, a malformed query/kind/limit, or an empty/oversized ids array fails with WF_KNOWLEDGE_BAD_ARGS; filesystem failures fail with WF_KNOWLEDGE_IO. Unknown ids are reported in missing instead of failing the whole call. '
            + 'Side effects: none; this tool is read-only.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['guide', 'recall', 'read'],
                description: 'guide = library overview + self-iteration protocol; recall = summary hits; read = full entries by ids.',
            },
            query: {
                type: 'string',
                description: 'Only for recall. Concrete goal, technology stack, or failure symptom. Omit it to list recent entries instead of searching.',
            },
            kind: {
                type: 'string',
                enum: [...KNOWLEDGE_KINDS],
                description: 'Only for recall. Optional filter: workflow_skill or error_lesson. Omit to search both.',
            },
            limit: {
                type: 'integer',
                description: `Only for recall. Maximum number of hits; defaults to ${DEFAULT_RECALL_LIMIT} and is capped at ${MAX_RECALL_LIMIT}.`,
            },
            ids: {
                type: 'array',
                items: { type: 'string', description: 'A generated skill name (wf-* or the bare name) or a lesson-* id.' },
                description: `Only for read. Non-empty list of ids to load in full; at most ${MAX_READ_IDS} per call.`,
            },
        },
        output: {
            schema: {
                type: 'object',
                additionalProperties: true,
                description: 'action="guide": counts/skills/recentLessons/protocol. action="recall": query/kind/total/source/hits. action="read": entries/missing.',
            },
            render: textRender,
        },
        async execute(args) {
            return service.recall(args ?? {});
        },
    });
    return registerTool(tools, definition);
}
