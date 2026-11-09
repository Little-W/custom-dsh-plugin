// src/host/knowledge/prompt.js
//
// 知识积累的模型可见措辞：常驻父代理提示词末尾的「知识积累规则」与
// wf_knowledge_recall({action:"guide"}) 返回的「自迭代指引」。
//
// 为什么正文集中在本文件：规则与指引描述的是同一套协议，只是详细程度不同。
// 任何一处单独改写都会让「提示词要求先召回、工具指引却要求先提交」这类矛盾出现。
import { isEnglishSystemLanguage } from '../system-language.js';
/** 常驻规则（精简版）：注入父代理编排/混合提示词与规划期提示词。 */
const KNOWLEDGE_RULE_ZH = `## 知识积累（构建与运行工作流时持续执行）

1. 先召回：规划、改图或排错前，先调 wf_knowledge_recall({action:"guide"}) 查看知识库概况与自迭代步骤；再按当前目标用 action:"recall" 召回既有工作流技能与错误教训，避免重复踩坑。
2. 沉淀技能：当一套节点拓扑、提示词、工具组合或交接约定被验证可复用时，调 wf_knowledge_capture({kind:"workflow_skill", name, description, whenToUse, content, source})。技能名会自动加 wf- 前缀；正文写清适用场景、步骤、验收标准、反例与注意事项。一次性细节不要写成技能。
3. 沉淀教训：错误被定位并修复后，立即调 wf_knowledge_capture({kind:"error_lesson", problem, rootCause, resolution, optimization, context})，按「现象 → 根因 → 修复 → 优化方向」记录；相同问题会自动合并计数，不要新建重复条目。
4. 自迭代：每轮收尾前再调 wf_knowledge_recall({action:"guide"})，检查是否有该合并、修订或升级为技能的知识；把稳定做法升级为技能，把反复出现的教训写入技能的注意事项。
5. 质量门槛：只写可复用、经过验证的知识；不写密钥、个人信息、一次性日志与未经验证的猜测；没有值得沉淀的内容时跳过，不要为了调用而调用。`;
const KNOWLEDGE_RULE_EN = `## Knowledge accumulation (run continuously while building and operating workflows)

1. Recall first: before planning, editing the graph, or debugging, call wf_knowledge_recall({action:"guide"}) for the library overview and self-iteration steps, then call action:"recall" with the current goal to retrieve existing workflow skills and error lessons. Do not reinvent what is already known.
2. Capture skills: once a node topology, prompt pattern, tool combo, or handoff convention is proven reusable, call wf_knowledge_capture({kind:"workflow_skill", name, description, whenToUse, content, source}). Names are automatically prefixed with wf-; the body must state the applicable situation, steps, acceptance criteria, counterexamples, and cautions. Never turn one-off details into a skill.
3. Capture lessons: immediately after an error is diagnosed and fixed, call wf_knowledge_capture({kind:"error_lesson", problem, rootCause, resolution, optimization, context}) in the form "symptom -> root cause -> fix -> optimization direction". Repeated occurrences merge into the same entry; do not create duplicates.
4. Self-iterate: before finishing each round, call wf_knowledge_recall({action:"guide"}) again and check whether any knowledge should be merged, revised, or promoted into a skill. Promote stable procedures into skills and write recurring lessons into those skills' cautions.
5. Quality gate: store only reusable, verified knowledge. Never store secrets, personal data, one-off logs, or unverified guesses. If nothing is worth keeping, skip the step instead of calling the tool for its own sake.`;
/** 常驻知识积累规则（纯函数；按系统语言二选一）。 */
export function knowledgeRuleOf(systemLanguage) {
    return isEnglishSystemLanguage(systemLanguage) ? KNOWLEDGE_RULE_EN : KNOWLEDGE_RULE_ZH;
}
/** 列表投影：空列表给「（无）」/ "(none)"，避免指引里出现空白行。 */
function listText(items, empty, limit = 8) {
    const rows = (Array.isArray(items) ? items : [])
        .map((item) => String(item ?? '').trim())
        .filter(Boolean);
    if (rows.length === 0)
        return empty;
    const shown = rows.slice(0, limit).join('、');
    return rows.length > limit ? `${shown}…` : shown;
}
function listTextEn(items, empty, limit = 8) {
    const rows = (Array.isArray(items) ? items : [])
        .map((item) => String(item ?? '').trim())
        .filter(Boolean);
    if (rows.length === 0)
        return empty;
    const shown = rows.slice(0, limit).join(', ');
    return rows.length > limit ? `${shown}...` : shown;
}
/**
 * 自迭代指引（guide 动作的正文）：把当前知识库事实投影成「下一步该做什么」。
 * 纯函数：同一输入必得同一输出；不做检索、不写盘。
 */
export function knowledgeGuideOf(input) {
    const english = isEnglishSystemLanguage(input?.systemLanguage);
    const skillCount = Number(input?.counts?.workflowSkill ?? 0);
    const lessonCount = Number(input?.counts?.errorLesson ?? 0);
    const skillNames = input?.skills ?? [];
    const recentLessons = input?.recentLessons ?? [];
    if (english) {
        return `## Knowledge library

- Workflow skills: ${skillCount}${skillCount > 0 ? ` (${listTextEn(skillNames, 'none')})` : ''}
- Error lessons: ${lessonCount}${lessonCount > 0 ? ` (latest: ${listTextEn(recentLessons, 'none', 5)})` : ''}
- Retrieval: lexical BM25 over Latin words and CJK bigrams; no embedding service required.

## Self-iteration steps

1. Recall before acting: search with the concrete goal, technology stack, and failure symptom; read full entries by id when a summary looks relevant.
2. Apply with verification: follow a recalled skill's steps, but re-check its \"when to use\" boundary and counterexamples against the current run. Treat a lesson as a hypothesis about the root cause, not a blind fix.
3. Capture while building: promote a proven topology, prompt pattern, tool combo, or handoff convention into a workflow_skill. Keep one skill per reusable capability and update it in place instead of creating near-duplicates.
4. Capture after fixing: record problem, rootCause, resolution, and optimization. A recurring problem must merge into the existing lesson so its occurrence count reflects reality.
5. Close the loop: before finishing, run guide again. Merge duplicate lessons, revise skills with new cautions, and delete or rewrite guidance that turned out to be wrong.
6. Quality gate: no secrets, personal data, one-off logs, or guesses. If nothing generalizes, stop without writing.

## Skill or lesson?

- Use workflow_skill when the knowledge answers \"how to build or operate this kind of workflow again\".
- Use error_lesson when the knowledge answers \"what went wrong, why, and how to prevent it next time\".
- When a lesson recurs in different workflows, keep the lesson and add a caution to the relevant skill; do not duplicate the whole story in both places.`;
    }
    return `## 知识库概况

- 工作流技能：${skillCount} 个${skillCount > 0 ? `（${listText(skillNames, '无')}）` : ''}
- 错误教训：${lessonCount} 条${lessonCount > 0 ? `（最近：${listText(recentLessons, '无', 5)}）` : ''}
- 检索方式：词法 BM25（拉丁词 + 中文二元组），不依赖嵌入服务。

## 自迭代步骤

1. 行动前先召回：用具体目标、技术栈与故障现象检索；摘要相关时再按 id 读取全文，不要只凭标题猜内容。
2. 带验证地套用：按召回技能的步骤执行，但先用「适用场景」与反例核对本次运行；把教训当作对根因的假设，而不是盲目照搬修复。
3. 构建中沉淀：把已验证的拓扑、提示词模式、工具组合或交接约定升级为 workflow_skill。一个可复用能力只保留一个技能，优先原地修订，不要制造近似重复项。
4. 修复后沉淀：记录 problem、rootCause、resolution、optimization。同一问题复发必须合并到既有教训，让 occurrences 如实反映复发次数。
5. 收尾闭环：结束前再跑一次 guide。合并重复教训、把新注意事项补进技能，并改写已被证明错误的指引。
6. 质量门槛：不写密钥、个人信息、一次性日志与猜测；没有可泛化的内容就停止，不要为了写入而写入。

## 技能还是教训？

- 当知识回答「这类工作流下次怎么构建/运行」时，用 workflow_skill。
- 当知识回答「这次为什么错、下次怎么避免」时，用 error_lesson。
- 当同一教训跨工作流反复出现时，保留教训，并把注意事项补进相关技能；不要在两个地方各写一遍完整故事。`;
}
