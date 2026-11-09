// src/host/knowledge/constants.ts
//
// 知识积累组件的稳定契约：知识类型、工具名、字段预算、错误码、落盘路径与
// DSH 用户技能根解析。
//
// 为什么全部集中在本文件：知识库同时被「模型侧工具」「提示词规则」「自迭代指引」
// 三处消费；任何一处各写一套上限或路径，都会让「工具说能写、提示词说别写、运行时
// 写到别处」三类漂移同时发生。本文件是这些事实的唯一本体。
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
/** 两种知识类型：可复用的工作流技能，与被修复过的错误教训。 */
export const KNOWLEDGE_KINDS = ['workflow_skill', 'error_lesson'];
/** 技能文件目录名（DSH 用户技能根下的目录；每个技能一个子目录 + SKILL.md）。 */
export const SKILL_FILE_NAME = 'SKILL.md';
/** 自动生成的技能统一前缀：避免与用户手写技能/其它插件技能重名。 */
export const SKILL_NAME_PREFIX = 'wf-';
/** DSH 官方技能名规则（kebab-case）。 */
export const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** 知识库在 dataDir 下的目录名。 */
export const KNOWLEDGE_DIR_NAME = 'knowledge';
/** 教训 JSON 目录名。 */
export const LESSONS_DIR_NAME = 'lessons';
/** 生成技能索引文件名（技能正文在 DSH 技能根，索引只存元数据）。 */
export const SKILLS_INDEX_FILE_NAME = 'skills-index.json';
/** 落盘结构版本：未来字段演进时据此迁移，不靠猜。 */
export const KNOWLEDGE_SCHEMA_VERSION = 1;
// ── 字段预算 ────────────────────────────────────────────────────────────
// 预算同时写进工具参数说明（生成引导）与运行期校验（护栏）：超限直接报错，
// 不做静默截断——静默截断会让模型误以为完整内容已入库。
export const MAX_SKILL_NAME = 64;
export const MAX_SKILL_DESCRIPTION = 500;
export const MAX_SKILL_WHEN_TO_USE = 1000;
export const MAX_SKILL_CONTENT = 40000;
export const MAX_LESSON_PROBLEM = 4000;
export const MAX_LESSON_ROOT_CAUSE = 4000;
export const MAX_LESSON_RESOLUTION = 8000;
export const MAX_LESSON_OPTIMIZATION = 4000;
export const MAX_LESSON_CONTEXT = 4000;
export const MAX_SOURCE = 200;
export const MAX_TAG = 64;
export const MAX_TAGS = 12;
export const MAX_RECALL_LIMIT = 20;
export const DEFAULT_RECALL_LIMIT = 8;
export const MAX_READ_IDS = 10;
/** 同一教训的合并历史最多保留条数（只留最近几次复发，避免文件无限增长）。 */
export const MAX_LESSON_HISTORY = 5;
/** 教训严重度取值域。 */
export const LESSON_SEVERITIES = ['low', 'medium', 'high'];
// ── 错误码 ──────────────────────────────────────────────────────────────
export const ERR_KNOWLEDGE_BAD_ARGS = 'WF_KNOWLEDGE_BAD_ARGS';
export const ERR_KNOWLEDGE_VALIDATION = 'WF_KNOWLEDGE_VALIDATION';
export const ERR_KNOWLEDGE_CONFLICT = 'WF_KNOWLEDGE_CONFLICT';
export const ERR_KNOWLEDGE_NOT_FOUND = 'WF_KNOWLEDGE_NOT_FOUND';
export const ERR_KNOWLEDGE_IO = 'WF_KNOWLEDGE_IO';
// ── 工具名 ──────────────────────────────────────────────────────────────
export const WF_KNOWLEDGE_CAPTURE = 'wf_knowledge_capture';
export const WF_KNOWLEDGE_RECALL = 'wf_knowledge_recall';
// ── 路径 ────────────────────────────────────────────────────────────────
/** 知识库根目录。 */
export function knowledgeRootOf(dataDir) {
    return join(resolve(String(dataDir ?? '')), KNOWLEDGE_DIR_NAME);
}
/** 教训 JSON 目录。 */
export function lessonsDirOf(dataDir) {
    return join(knowledgeRootOf(dataDir), LESSONS_DIR_NAME);
}
/** 生成技能索引文件。 */
export function skillsIndexPathOf(dataDir) {
    return join(knowledgeRootOf(dataDir), SKILLS_INDEX_FILE_NAME);
}
/** 教训文件路径（id 必须已通过格式校验）。 */
export function lessonPathOf(dataDir, id) {
    return join(lessonsDirOf(dataDir), `${id}.json`);
}
/** 展开受支持的 `~` 前缀（与 DSH home-paths 的语义保持一致）。 */
function expandHomePath(path) {
    if (path === '~')
        return homedir();
    if (path.startsWith('~/') || path.startsWith('~\\'))
        return join(homedir(), path.slice(2));
    return path;
}
/**
 * 解析 DSH home：显式 `$DSH_HOME` 优先，空白视为未设置；否则回退 `~/.dsh`。
 * 与官方 `@deepseek-ai/dsh-home-paths` 的 `resolveDshHome` 同口径。
 */
export function resolveDshHome(env = process.env) {
    const configured = String(env?.DSH_HOME ?? '').trim();
    return resolve(configured ? expandHomePath(configured) : join(homedir(), '.dsh'));
}
/** DSH 用户技能根（官方 skill-filesystem 的 user-dsh root）。 */
export function userSkillsRootOf(env = process.env) {
    return join(resolveDshHome(env), 'skills');
}
/** 生成技能的文件路径。 */
export function userSkillPathOf(name, env = process.env) {
    return join(userSkillsRootOf(env), name, SKILL_FILE_NAME);
}
/** 教训 id 的安全格式（读文件前必须先过这一关，杜绝路径穿越）。 */
export const LESSON_ID_PATTERN = /^lesson-[a-f0-9]{16}$/;
