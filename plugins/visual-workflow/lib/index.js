// src/host/index.ts
//
// DSH Visual Workflow —— Host 半区插件入口（历史单一文件拆分后的收口文件）：
//   - apply 挂载 visualWorkflowHost service（装配细节见 visual-workflow-host.ts）；
//   - 入口 re-export 拆分前的全部公共 API（插件契约见 config.ts），外部引用路径
//     不变（service-runner / 测试均从本入口导入）。
import { VisualWorkflowHost } from './visual-workflow-host.js';
import { resolveConfig } from './config.js';
// ── 插件入口 ────────────────────────────────────────────────────────────
/** 插件 apply 入口：实例化并注册 visualWorkflowHost service（随 fiber 自动注销）。 */
export function apply(ctx, config) {
    const resolved = resolveConfig(config);
    ctx.plugin(VisualWorkflowHost, resolved);
    // 知识积累组件不再作为内部子插件挂载：它在 cordis.patch.yml 中是一条独立
    // insert 行（name: dsh-visual-workflow/knowledge），因此会作为独立组件
    // 出现在 DSH 的「包含的组件」列表中，并可单独启停。
}
// ---------------------------------------------------------------------------
// re-export：原入口公共 API（拆分后外部引用路径不变）
// ---------------------------------------------------------------------------
export { name, inject, Config } from './config.js';
export { VisualWorkflowHost, VisualWorkflowHostServiceName } from './visual-workflow-host.js';
//# sourceMappingURL=index.js.map