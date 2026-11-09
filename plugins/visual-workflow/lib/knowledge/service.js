// src/host/knowledge/service.js
//
// 知识积累领域服务：capture（沉淀）/ recall（召回）/ read（读全文）/ guide（自迭代指引）。
//
// 职责边界：
//   - 本层拥有「什么算合法知识、技能名如何归一、教训如何合并、召回如何排序」；
//   - 字节读写交给 store.js，运行期技能注册只经 ctx.skills 的能力缝；
//   - 不读取工作流图、不依赖编排器内部状态——知识库对运行细节只接受调用方显式传入的事实。
import { createHash } from 'node:crypto';
import { WfError } from '../orchestrator/errors.js';
import { KnowledgeStore, renderSkillMarkdown } from './store.js';
import { knowledgeGuideOf } from './prompt.js';
import { DEFAULT_RECALL_LIMIT, ERR_KNOWLEDGE_BAD_ARGS, ERR_KNOWLEDGE_CONFLICT, ERR_KNOWLEDGE_IO, ERR_KNOWLEDGE_VALIDATION, KNOWLEDGE_KINDS, KNOWLEDGE_SCHEMA_VERSION, LESSON_SEVERITIES, MAX_LESSON_CONTEXT, MAX_LESSON_HISTORY, MAX_LESSON_OPTIMIZATION, MAX_LESSON_PROBLEM, MAX_LESSON_RESOLUTION, MAX_LESSON_ROOT_CAUSE, MAX_READ_IDS, MAX_RECALL_LIMIT, MAX_SKILL_CONTENT, MAX_SKILL_DESCRIPTION, MAX_SKILL_NAME, MAX_SKILL_WHEN_TO_USE, MAX_SOURCE, MAX_TAG, MAX_TAGS, SKILL_NAME_PATTERN, SKILL_NAME_PREFIX, } from './constants.js';
const BM25_K1 = 1.2;
const BM25_B = 0.75;
/** 非字符串归一为空串（工具参数可能来自任意 JSON 客户端）。 */
function textOf(value) {
    return typeof value === 'string' ? value : '';
}
/** 保留换行、去掉首尾空白。 */
function trimText(value) {
    return textOf(value).replace(/\r\n/g, '\n').trim();
}
/** 单行归一：折叠空白（用于名称、标签、来源与元数据字段）。 */
function oneLine(value) {
    return textOf(value).replace(/\s+/g, ' ').trim();
}
function badArgs(message) {
    return new WfError(`WF_KNOWLEDGE_BAD_ARGS: ${message}`, ERR_KNOWLEDGE_BAD_ARGS);
}
/** 必填文本 + 长度预算校验（不做静默截断）。 */
function requireText(value, field, max) {
    const text = trimText(value);
    if (!text)
        throw badArgs(`${field} is required and must be a non-empty string`);
    if (text.length > max)
        throw new WfError(`WF_KNOWLEDGE_VALIDATION: ${field} exceeds ${max} characters (got ${text.length}); shorten it instead of relying on truncation`, ERR_KNOWLEDGE_VALIDATION);
    return text;
}
/** 可选文本 + 长度预算校验；缺失返回空串。 */
function optionalText(value, field, max) {
    const text = trimText(value);
    if (!text)
        return '';
    if (text.length > max)
        throw new WfError(`WF_KNOWLEDGE_VALIDATION: ${field} exceeds ${max} characters (got ${text.length}); shorten it`, ERR_KNOWLEDGE_VALIDATION);
    return text;
}
/** 知识类型归一：未知取值给出合法枚举。 */
export function parseKnowledgeKind(value) {
    const kind = oneLine(value).toLowerCase();
    if (!KNOWLEDGE_KINDS.includes(kind))
        throw badArgs(`kind must be one of ${KNOWLEDGE_KINDS.join(', ')} (got "${oneLine(value) || '(missing)'}")`);
    return kind;
}
/** 严重度归一；缺失返回空串（合并时表示保留原值）。 */
function parseSeverity(value) {
    const severity = oneLine(value).toLowerCase();
    if (!severity)
        return '';
    if (!LESSON_SEVERITIES.includes(severity))
        throw badArgs(`severity must be one of ${LESSON_SEVERITIES.join(', ')} (got "${severity}")`);
    return severity;
}
/** 标签归一：去空、去重（大小写不敏感）、逐项与总量都有预算。 */
function normalizeTags(value) {
    if (value === undefined || value === null)
        return [];
    if (!Array.isArray(value))
        throw badArgs('tags must be an array of strings');
    const seen = new Set();
    const tags = [];
    for (const item of value) {
        const tag = oneLine(item);
        if (!tag)
            continue;
        if (tag.length > MAX_TAG)
            throw new WfError(`WF_KNOWLEDGE_VALIDATION: each tag must be at most ${MAX_TAG} characters (got "${tag.slice(0, 40)}...")`, ERR_KNOWLEDGE_VALIDATION);
        const key = tag.toLowerCase();
        if (seen.has(key))
            continue;
        seen.add(key);
        tags.push(tag);
    }
    if (tags.length > MAX_TAGS)
        throw new WfError(`WF_KNOWLEDGE_VALIDATION: at most ${MAX_TAGS} tags are allowed (got ${tags.length})`, ERR_KNOWLEDGE_VALIDATION);
    return tags;
}
/** 技能名归一：小写、非法字符转连字符、自动加 wf- 前缀，最后按官方 kebab-case 校验。 */
export function normalizeSkillName(value) {
    const raw = oneLine(value).toLowerCase();
    if (!raw)
        throw badArgs('name is required for workflow_skill');
    let name = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!name)
        throw badArgs(`name "${oneLine(value)}" contains no usable latin letters or digits`);
    if (!name.startsWith(SKILL_NAME_PREFIX))
        name = `${SKILL_NAME_PREFIX}${name}`;
    if (!SKILL_NAME_PATTERN.test(name))
        throw new WfError(`WF_KNOWLEDGE_VALIDATION: normalized skill name "${name}" is not valid kebab-case`, ERR_KNOWLEDGE_VALIDATION);
    if (name.length > MAX_SKILL_NAME)
        throw new WfError(`WF_KNOWLEDGE_VALIDATION: skill name "${name}" exceeds ${MAX_SKILL_NAME} characters; use a shorter capability name`, ERR_KNOWLEDGE_VALIDATION);
    return name;
}
/** 召回条数归一：缺省用默认值，显式非法值直接报错，超上限截到上限。 */
function normalizeLimit(value) {
    if (value === undefined || value === null || value === '')
        return DEFAULT_RECALL_LIMIT;
    const limit = Number(value);
    if (!Number.isFinite(limit) || limit <= 0)
        throw badArgs('limit must be a positive number');
    return Math.min(Math.floor(limit), MAX_RECALL_LIMIT);
}
/** 读取 id 列表归一：非空、去重、上限 MAX_READ_IDS。 */
function normalizeIds(value) {
    if (!Array.isArray(value) || value.length === 0)
        throw badArgs('ids must be a non-empty array of knowledge ids');
    const seen = new Set();
    const ids = [];
    for (const item of value) {
        const id = oneLine(item);
        if (!id)
            continue;
        if (seen.has(id))
            continue;
        seen.add(id);
        ids.push(id);
    }
    if (ids.length === 0)
        throw badArgs('ids must contain at least one non-empty id');
    if (ids.length > MAX_READ_IDS)
        throw badArgs(`at most ${MAX_READ_IDS} ids may be read in one call (got ${ids.length})`);
    return ids;
}
/** 标签并集（保留既有顺序，新增项按大小写不敏感去重）。 */
function mergeTags(existing, incoming) {
    const tags = [];
    const seen = new Set();
    for (const item of [...(Array.isArray(existing) ? existing : []), ...incoming]) {
        const tag = oneLine(item);
        if (!tag)
            continue;
        const key = tag.toLowerCase();
        if (seen.has(key))
            continue;
        seen.add(key);
        tags.push(tag);
    }
    return tags.slice(0, MAX_TAGS);
}
/** 教训 id：由「现象 + 根因」的指纹决定，同一问题必然落到同一文件。 */
export function lessonIdOf(problem, rootCause) {
    const fingerprint = createHash('sha256')
        .update(`${trimText(problem)}\n${trimText(rootCause)}`)
        .digest('hex');
    return `lesson-${fingerprint.slice(0, 16)}`;
}
function truncate(text, max) {
    const value = oneLine(text);
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
/** 词法分词：拉丁词按词切分，中日韩文本按二元组切分（与经验域同一口径）。 */
function tokenizeForLexical(text) {
    const tokens = [];
    const pattern = /[a-z0-9]+|[\u4e00-\u9fff]+/gu;
    for (const match of text.toLowerCase().matchAll(pattern)) {
        const piece = match[0];
        if (piece.length === 1 || /^[a-z0-9]+$/u.test(piece)) {
            tokens.push(piece);
            continue;
        }
        for (let index = 0; index + 1 < piece.length; index += 1)
            tokens.push(piece.slice(index, index + 2));
    }
    return tokens;
}
/** BM25 词法评分（按文档顺序返回得分）。 */
function bm25Scores(query, documents) {
    if (documents.length === 0)
        return [];
    const queryTokens = [...new Set(tokenizeForLexical(query))];
    const documentTokens = documents.map((document) => tokenizeForLexical(document));
    const totalLength = documentTokens.reduce((sum, tokens) => sum + tokens.length, 0);
    const averageLength = totalLength / documentTokens.length;
    const scores = documents.map(() => 0);
    for (const token of queryTokens) {
        const frequencies = documentTokens.map((tokens) => tokens.filter((item) => item === token).length);
        const documentFrequency = frequencies.filter((count) => count > 0).length;
        if (documentFrequency === 0)
            continue;
        const idf = Math.log(1 + (documents.length - documentFrequency + 0.5) / (documentFrequency + 0.5));
        frequencies.forEach((frequency, index) => {
            if (frequency === 0)
                return;
            const length = documentTokens[index].length;
            const lengthRatio = averageLength > 0 ? length / averageLength : 0;
            const denominator = frequency + BM25_K1 * (1 - BM25_B + BM25_B * lengthRatio);
            scores[index] += (idf * frequency * (BM25_K1 + 1)) / denominator;
        });
    }
    return scores;
}
/** 技能检索行（摘要 + 可检索文本）。 */
function skillRow(entry) {
    return {
        id: entry.name,
        kind: 'workflow_skill',
        title: entry.name,
        summary: truncate(entry.description, 200),
        description: entry.description,
        whenToUse: entry.whenToUse ?? '',
        tags: Array.isArray(entry.tags) ? entry.tags : [],
        occurrences: Number(entry.occurrences) || 1,
        updatedAt: entry.updatedAt ?? entry.createdAt ?? '',
        searchText: [entry.name, entry.description, entry.whenToUse, ...(Array.isArray(entry.tags) ? entry.tags : [])]
            .filter(Boolean)
            .join('\n'),
    };
}
/** 教训检索行（摘要 + 可检索文本）。 */
function lessonRow(lesson) {
    return {
        id: lesson.id,
        kind: 'error_lesson',
        title: truncate(lesson.problem, 120),
        summary: truncate(lesson.rootCause, 200),
        severity: lesson.severity ?? 'medium',
        tags: Array.isArray(lesson.tags) ? lesson.tags : [],
        occurrences: Number(lesson.occurrences) || 1,
        updatedAt: lesson.updatedAt ?? lesson.createdAt ?? '',
        searchText: [
            lesson.problem,
            lesson.rootCause,
            lesson.resolution,
            lesson.optimization,
            lesson.context,
            lesson.source,
            ...(Array.isArray(lesson.tags) ? lesson.tags : []),
        ]
            .filter(Boolean)
            .join('\n'),
    };
}
function publicRow(row) {
    const { searchText, ...rest } = row;
    return rest;
}
export class KnowledgeService {
    constructor(options = {}) {
        const dataDir = String(options.dataDir ?? '').trim();
        if (!dataDir)
            throw new Error('KnowledgeService: dataDir is required');
        this.dataDir = dataDir;
        this.now = options.now ?? (() => Date.now());
        this.logger = options.logger ?? { info: () => { }, warn: () => { }, error: () => { } };
        this.systemLanguage = options.systemLanguage ?? (() => '中文');
        this.env = options.env ?? process.env;
        this.store = new KnowledgeStore(dataDir, { env: this.env, logger: this.logger });
        this.skills = null;
        this.runtimeDisposers = new Map();
        this.disposed = false;
        this.ready = null;
    }
    /** 延迟初始化（幂等）：目录建立失败在首次调用时以可操作错误暴露。 */
    start() {
        if (!this.ready) {
            this.ready = this.store.init().catch((error) => {
                this.logger.error?.(`[visual-workflow] knowledge: cannot initialize at ${this.dataDir}: ${error?.message ?? error}`);
                throw error;
            });
            // 避免「还没有调用方 await」时出现未处理拒绝；真正的错误仍由后续 await 抛出。
            this.ready.catch(() => { });
        }
        return this.ready;
    }
    /** 统一错误包装：领域错误原样上抛，IO/解析错误转成带错误码的可操作消息。 */
    async _guard(action, task) {
        try {
            await this.start();
            return await task();
        }
        catch (error) {
            if (error instanceof WfError)
                throw error;
            throw new WfError(`WF_KNOWLEDGE_IO: ${action} failed at ${this.dataDir}: ${error?.message ?? error}`, ERR_KNOWLEDGE_IO);
        }
    }
    /** 捕获知识：按 kind 分派到工作流技能或错误教训。 */
    async capture(input) {
        return this._guard('capture', async () => {
            const kind = parseKnowledgeKind(input?.kind);
            return kind === 'workflow_skill'
                ? this._captureWorkflowSkill(input)
                : this._captureErrorLesson(input);
        });
    }
    /** 召回知识：guide（自迭代指引）/ recall（摘要检索）/ read（按 id 读全文）。 */
    async recall(input) {
        return this._guard('recall', async () => {
            const action = oneLine(input?.action).toLowerCase();
            if (action === 'guide')
                return this._guide();
            if (action === 'recall')
                return this._search(input);
            if (action === 'read')
                return this._read(input);
            throw badArgs(`action must be one of guide, recall, read (got "${oneLine(input?.action) || '(missing)'}")`);
        });
    }
    // ── 技能 ────────────────────────────────────────────────────────────
    async _captureWorkflowSkill(input) {
        const name = normalizeSkillName(input?.name);
        const description = requireText(input?.description, 'description', MAX_SKILL_DESCRIPTION);
        const whenToUse = optionalText(input?.whenToUse, 'whenToUse', MAX_SKILL_WHEN_TO_USE);
        const content = requireText(input?.content, 'content', MAX_SKILL_CONTENT);
        const tags = normalizeTags(input?.tags);
        const source = optionalText(input?.source, 'source', MAX_SOURCE);
        const overwrite = input?.overwrite === true;
        const existing = await this.store.getSkillEntry(name);
        const fileExists = await this.store.hasSkillFile(name);
        // 索引丢失但文件带生成标记时按「生成技能」恢复，避免把上次半失败写入误判成用户文件。
        const generatedFile = fileExists && existing === null ? await this.store.isGeneratedSkillFile(name) : false;
        const protectedFile = fileExists && existing === null && !generatedFile;
        // 只保护「不是本组件生成」的 SKILL.md：用户手写技能不能被一次普通 capture 覆盖。
        if (protectedFile && !overwrite) {
            throw new WfError(`WF_KNOWLEDGE_CONFLICT: skill "${name}" already exists at ${this.store.skillPathOf(name)} and was not created by wf_knowledge_capture; review it first, then pass overwrite:true to replace it, or choose another name`, ERR_KNOWLEDGE_CONFLICT);
        }
        const now = new Date(this.now()).toISOString();
        const entry = {
            schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
            kind: 'workflow_skill',
            name,
            description,
            ...(whenToUse ? { whenToUse } : {}),
            tags,
            ...(source ? { source } : {}),
            path: this.store.skillPathOf(name),
            occurrences: (Number(existing?.occurrences) || 0) + 1,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        await this.store.writeSkillMarkdown(name, renderSkillMarkdown(entry, content));
        await this.store.putSkillEntry(entry);
        const runtime = this._installRuntimeSkill(entry, content);
        return {
            kind: 'workflow_skill',
            id: name,
            name,
            created: existing === null,
            updated: existing !== null,
            recovered: generatedFile,
            overwroteUntracked: protectedFile && overwrite,
            occurrences: entry.occurrences,
            path: entry.path,
            skillsRoot: this.store.skillsRoot,
            runtimeRegistered: runtime.registered,
            ...(runtime.reason ? { runtimeReason: runtime.reason } : {}),
        };
    }
    // ── 教训 ────────────────────────────────────────────────────────────
    async _captureErrorLesson(input) {
        const problem = requireText(input?.problem, 'problem', MAX_LESSON_PROBLEM);
        const rootCause = requireText(input?.rootCause, 'rootCause', MAX_LESSON_ROOT_CAUSE);
        const resolution = requireText(input?.resolution, 'resolution', MAX_LESSON_RESOLUTION);
        const optimization = optionalText(input?.optimization, 'optimization', MAX_LESSON_OPTIMIZATION);
        const context = optionalText(input?.context, 'context', MAX_LESSON_CONTEXT);
        const severity = parseSeverity(input?.severity);
        const tags = normalizeTags(input?.tags);
        const source = optionalText(input?.source, 'source', MAX_SOURCE);
        const id = lessonIdOf(problem, rootCause);
        const now = new Date(this.now()).toISOString();
        const { lesson, created } = await this.store.updateLesson(id, (existing) => {
            if (!existing) {
                return {
                    schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
                    id,
                    kind: 'error_lesson',
                    problem,
                    rootCause,
                    resolution,
                    optimization,
                    context,
                    severity: severity || 'medium',
                    tags,
                    ...(source ? { source } : {}),
                    occurrences: 1,
                    createdAt: now,
                    updatedAt: now,
                    history: [{ at: now, ...(source ? { source } : {}), note: 'created' }],
                };
            }
            return {
                ...existing,
                problem: existing.problem || problem,
                rootCause: existing.rootCause || rootCause,
                resolution: resolution || existing.resolution,
                optimization: optimization || existing.optimization || '',
                context: context || existing.context || '',
                severity: severity || existing.severity || 'medium',
                tags: mergeTags(existing.tags, tags),
                ...(source ? { source } : {}),
                occurrences: (Number(existing.occurrences) || 1) + 1,
                updatedAt: now,
                history: [
                    ...(Array.isArray(existing.history) ? existing.history : []),
                    { at: now, ...(source ? { source } : {}), note: 'recurred' },
                ].slice(-MAX_LESSON_HISTORY),
            };
        });
        return {
            kind: 'error_lesson',
            id,
            created,
            merged: !created,
            occurrences: lesson.occurrences,
            severity: lesson.severity,
            path: this.store.lessonPathOf(id),
        };
    }
    // ── 召回 ────────────────────────────────────────────────────────────
    async _search(input) {
        const query = trimText(input?.query);
        const kind = oneLine(input?.kind) ? parseKnowledgeKind(input.kind) : '';
        const limit = normalizeLimit(input?.limit);
        const skills = kind && kind !== 'workflow_skill' ? [] : await this.store.listSkillEntries();
        const lessons = kind && kind !== 'error_lesson' ? [] : await this.store.listLessons();
        const rows = [
            ...skills.map(skillRow),
            ...lessons.map(lessonRow),
        ];
        let selected;
        let source;
        if (query) {
            const scores = bm25Scores(query, rows.map((row) => row.searchText));
            selected = rows
                .map((row, index) => ({ row, score: scores[index] ?? 0 }))
                .filter((item) => item.score > 0)
                .sort((left, right) => right.score !== left.score
                ? right.score - left.score
                : left.row.id.localeCompare(right.row.id));
            source = 'bm25';
        }
        else {
            selected = [...rows]
                .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
                .map((row) => ({ row, score: 0 }));
            source = 'recent';
        }
        const hits = selected.slice(0, limit).map(({ row, score }) => ({
            ...publicRow(row),
            score: Number(score.toFixed(4)),
        }));
        return {
            action: 'recall',
            query,
            kind: kind || 'all',
            total: rows.length,
            source,
            hits,
            ...(query && hits.length === 0
                ? { note: 'no positive lexical match; retry with different terms or omit query to list recent entries' }
                : {}),
        };
    }
    async _read(input) {
        const ids = normalizeIds(input?.ids);
        const entries = [];
        const missing = [];
        for (const id of ids) {
            if (id.startsWith('lesson-')) {
                const lesson = await this.store.getLesson(id);
                if (!lesson) {
                    missing.push(id);
                    continue;
                }
                entries.push({ ...lesson });
                continue;
            }
            let entry = await this.store.getSkillEntry(id);
            if (!entry && !id.startsWith(SKILL_NAME_PREFIX)) {
                entry = await this.store.getSkillEntry(`${SKILL_NAME_PREFIX}${id}`);
            }
            if (!entry) {
                missing.push(id);
                continue;
            }
            let content = '';
            try {
                content = await this.store.readSkillBody(entry.name);
            }
            catch (error) {
                this.logger.warn?.(`[visual-workflow] knowledge: cannot read skill file ${entry.name}: ${error?.message ?? error}`);
            }
            entries.push({ kind: 'workflow_skill', id: entry.name, ...entry, content });
        }
        return { action: 'read', entries, missing };
    }
    async _guide() {
        const skills = await this.store.listSkillEntries();
        const lessons = await this.store.listLessons();
        const counts = { workflowSkill: skills.length, errorLesson: lessons.length };
        const protocol = knowledgeGuideOf({
            systemLanguage: this.systemLanguage(),
            counts,
            skills: skills.map((entry) => entry.name),
            recentLessons: lessons.slice(0, 5).map((lesson) => truncate(lesson.problem, 120)),
        });
        return {
            action: 'guide',
            counts,
            // 结构化清单只给前 50 个：完整计数在 counts，避免知识库变大后单次输出膨胀。
            skills: skills.slice(0, 50).map((entry) => ({
                name: entry.name,
                description: entry.description,
                whenToUse: entry.whenToUse ?? '',
                updatedAt: entry.updatedAt ?? entry.createdAt ?? '',
            })),
            recentLessons: lessons.slice(0, 5).map((lesson) => ({
                id: lesson.id,
                problem: truncate(lesson.problem, 200),
                severity: lesson.severity ?? 'medium',
                occurrences: Number(lesson.occurrences) || 1,
                updatedAt: lesson.updatedAt ?? lesson.createdAt ?? '',
            })),
            protocol,
        };
    }
    // ── 运行期技能注册（可选能力缝） ────────────────────────────────────
    /**
     * 接入 ctx.skills：接入后立即把已生成的技能注册为运行期技能，返回卸载函数。
     * 注册失败只降级为「文件已写入但本次运行不可见」，不回滚知识入库。
     */
    attachSkills(skills) {
        if (this.disposed)
            return () => { };
        this.skills = skills;
        void this._reloadRuntimeSkills();
        return () => {
            for (const dispose of this.runtimeDisposers.values()) {
                try {
                    dispose();
                }
                catch {
                    // 注销尽力而为
                }
            }
            this.runtimeDisposers.clear();
            this.skills = null;
        };
    }
    async _reloadRuntimeSkills() {
        try {
            await this.start();
            const entries = await this.store.listSkillEntries();
            for (const entry of entries) {
                if (this.disposed || !this.skills)
                    return;
                try {
                    const body = await this.store.readSkillBody(entry.name);
                    this._installRuntimeSkill(entry, body);
                }
                catch (error) {
                    this.logger.warn?.(`[visual-workflow] knowledge: cannot register runtime skill ${entry.name}: ${error?.message ?? error}`);
                }
            }
        }
        catch (error) {
            this.logger.warn?.(`[visual-workflow] knowledge: cannot reload runtime skills: ${error?.message ?? error}`);
        }
    }
    _installRuntimeSkill(entry, content) {
        if (this.disposed)
            return { registered: false, reason: 'knowledge component disposed' };
        if (!this.skills || typeof this.skills.register !== 'function') {
            return { registered: false, reason: 'skills service unavailable; the skill file is still written and will be discovered on the next skill refresh' };
        }
        const previous = this.runtimeDisposers.get(entry.name);
        if (previous) {
            try {
                previous();
            }
            catch {
                // 旧注册可能已被外部撤销
            }
            this.runtimeDisposers.delete(entry.name);
        }
        try {
            const dispose = this.skills.register({
                name: entry.name,
                description: entry.description,
                ...(entry.whenToUse ? { whenToUse: entry.whenToUse } : {}),
                content: String(content ?? '').trim(),
                provider: 'dsh-visual-workflow-knowledge',
            });
            if (typeof dispose === 'function')
                this.runtimeDisposers.set(entry.name, dispose);
            return { registered: true };
        }
        catch (error) {
            this.logger.warn?.(`[visual-workflow] knowledge: runtime skill registration failed for ${entry.name}: ${error?.message ?? error}`);
            return { registered: false, reason: String(error?.message ?? error) };
        }
    }
    /** 卸载：清空运行期注册（文件与索引保留）。 */
    dispose() {
        this.disposed = true;
        for (const dispose of this.runtimeDisposers.values()) {
            try {
                dispose();
            }
            catch {
                // 注销尽力而为
            }
        }
        this.runtimeDisposers.clear();
        this.skills = null;
    }
}
