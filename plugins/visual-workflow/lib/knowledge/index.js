// src/host/knowledge/index.js
//
// 知识积累组件的装配入口：把 KnowledgeService、两个模型侧工具与可选的
// ctx.skills 运行期注册接到插件 fiber 上。
//
// 为什么独立成组件而不是继续塞进 VisualWorkflowHost：
//   - 知识库不依赖工作流图、编排器或运行历史，只依赖 dataDir 与可选 skills 服务；
//   - 本模块在 cordis.patch.yml 中是独立 insert 行（name:
//     dsh-visual-workflow/knowledge），因此会出现在 DSH「包含的组件」列表中，
//     可单独启停；卸载时知识工具与运行期技能随本 fiber 一起撤销；
//   - 组件可被单独阅读、测试与替换，不要求理解整个 Host。
import { KnowledgeService } from './service.js';
import { registerWfKnowledgeCapture, registerWfKnowledgeRecall } from './tool.js';
import { systemLanguageOf } from '../system-language.js';
/** 独立组件稳定标识名（仅用于诊断；不与 Host 插件名冲突）。 */
export const name = 'dsh-visual-workflow-knowledge';
/** 工具注册强依赖 tools 服务；skills 服务按可选能力注入。 */
export const inject = ['tools'];
/** 把宿主 logger 适配成知识服务的窄接口。 */
function loggerOf(ctx) {
    return {
        info: (message) => ctx.logger?.info?.(message),
        warn: (message) => ctx.logger?.warn?.(message),
        error: (message) => ctx.logger?.error?.(message),
    };
}
/**
 * 组件 apply：由 cordis.patch.yml 的独立 insert 行挂载（config.dataDir 必须提供）。
 * dataDir 缺失时只禁用知识库并记录错误——Host 自身会在 init 阶段对空 dataDir 抛错，
 * 这里不再制造第二个级联失败，但模型侧不会拿到两个必然失败的工具。
 */
export function apply(ctx, config) {
    const dataDir = String(config?.dataDir ?? '').trim();
    const logger = loggerOf(ctx);
    if (!dataDir) {
        logger.error?.('[visual-workflow] knowledge component disabled: dataDir is empty');
        return;
    }
    const service = new KnowledgeService({
        dataDir,
        logger,
        systemLanguage: () => systemLanguageOf(ctx.get('settings')),
    });
    // 目录初始化在首次工具调用时 await；这里提前启动，避免第一次 capture 多等一次 IO。
    service.start();
    ctx.effect(() => () => service.dispose(), 'visualWorkflowKnowledge.dispose');
    ctx.effect(() => registerWfKnowledgeCapture(ctx, service), 'visualWorkflowKnowledge.wfKnowledgeCapture');
    ctx.effect(() => registerWfKnowledgeRecall(ctx, service), 'visualWorkflowKnowledge.wfKnowledgeRecall');
    // skills 是可选服务：缺失时知识仍落盘，只是本次运行无法立即以运行期技能出现。
    ctx.inject(['skills'], (skillsCtx) => {
        skillsCtx.effect(() => service.attachSkills(skillsCtx.skills), 'visualWorkflowKnowledge.skills');
    });
}
export { KnowledgeService } from './service.js';
export { KNOWLEDGE_KINDS, WF_KNOWLEDGE_CAPTURE, WF_KNOWLEDGE_RECALL } from './constants.js';
export { knowledgeGuideOf, knowledgeRuleOf } from './prompt.js';
