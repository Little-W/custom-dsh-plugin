# Codex 与 OpenCode 提示词设计提取

本文件基于用户指定的两个本地源码目录，区分原文、运行时拼装机制和 DSH 的迁移设计。可逐条核对的原文片段、行号、文件哈希、提交与工作区修改状态保存在 [upstream-prompt-design.json](./upstream-prompt-design.json)。该提取材料用于设计审查，不会整体注入模型。

## Codex：模型指令与运行上下文分层

| 层次 | 源码位置（相对 openai-codex） | 实际机制与设计含义 |
| --- | --- | --- |
| 模型基础指令 | `codex-rs/prompts/src/model_instructions.rs`、`model_messages.rs` | 从捕获的 `ModelInfo.model_messages` 获取字面指令模板；不能仅凭仓库中存在某个 Markdown 文件，断言所有模型使用它。 |
| 配置覆盖与后备模型 | `codex-rs/models-manager/src/model_info.rs` | 显式 `base_instructions` 覆盖模型模板；未知模型的后备描述使用 `models-manager/prompt.md`。模型消息、配置与后备文本是不同来源。 |
| 基础文本的消息角色 | `codex-rs/core/src/context/base_instructions.rs` | 基础指令作为独立的 developer 片段，而非把所有上下文拼成一段无来源的文本。 |
| 用户与部署指令 | `codex-rs/core/src/context/developer_instructions.rs`、`user_instructions.rs` | developer 指令与带目录归属的 AGENTS.md 用户指令使用不同片段类型和角色。 |
| 动态运行状态 | `codex-rs/core/src/context/world_state/mod.rs` | 模型、环境、工具、模式、权限、AGENTS.md、插件等拆成可识别的状态模块；固定行为原则与变化中的环境事实分开。 |
| 行为参考文本 | `codex-rs/core/gpt_5_2_prompt.md`、`models-manager/prompt.md` | 包含任务执行、验证、计划粒度、沟通、工具使用和“Ambition vs. precision”等规则。它们的存在不等于当前所选模型必然使用该整份文件。 |
| 工程人格 | `codex-rs/core/templates/personalities/gpt-5.2-codex_pragmatic.md` | 强调清晰、务实、严谨，关注实际进展和可以评估的方案取舍。 |

可迁移的行为设计：

1. 把行动请求推进到实现与验证，工具失败后继续调查并调整方法。
2. 计划用于复杂性和依赖管理，不替代已经明确授权的工作。
3. 创造性与范围共同约束：新任务允许有判断力的主动设计；既有项目的改动要尊重具体目标、现有结构和用户工作。
4. 输出围绕已验证结果、尚未解决的事实和实际取舍，避免用反复的计划或叙述代替进展。

## OpenCode：通用骨架、能力渲染与模型优化

| 层次 | 源码位置（相对 opencode） | 实际机制与设计含义 |
| --- | --- | --- |
| 通用骨架 | `packages/core/src/session/runner/prompt/system.txt` | 提供运行身份、基本沟通、并行工具使用和代码库协作原则，保留 `${OPENCODE_TOOL_GUIDANCE}` 插槽。 |
| 按工具能力渲染 | `packages/core/src/session/system-prompt.ts` | `make/render` 依据实际工具名追加 shell、write、edit 指引；没有对应工具时不渲染该指引。 |
| 基础请求 | `packages/core/src/session/model-request.ts` 的 `baseTranscript` | 优先使用 agent 自定义 system，否则生成通用 system；独立加入运行指令来源生成的 system 部分。 |
| 模型优化插件 | `packages/core/src/plugin/optimize.ts` | GPT、Astra、Claude、Kimi、Trinity、Muse 等使用不同模板；通常 override，Claude 使用 append；有自定义 agent system 时跳过模板覆盖。钩子覆盖 context、compaction、generate。 |
| 工具优化的实际启用状态 | 同上 | 文件定义了可能删去 grep/glob 的优化插件，但它们未列入导出的 `Plugins` 默认数组，注释也说明当前禁用；不能把定义存在当作默认运行行为。 |
| 任务行为模板 | `packages/core/src/plugin/system-prompt/gpt-astra.txt`、`meta.txt`、`kimi.txt` | 分别提供主动完成请求、证据优先核实、迭代实现与验证、使用工具完成实际工作的指引。不同模板有不同选择和限制，不能全部直接拼接。 |
| 指令来源与变化 | `packages/core/src/instructions/index.ts`、`builtins.ts` | 指令有 key、值、哈希和 initial/changed/removed 渲染；临时读取失败与确定删除分开，环境与日期可独立变化。 |
| 上下文恢复 | `packages/core/src/session/instructions.ts` | 已注入指令以模型可见的持久历史为依据去重；压缩或撤回使指令不再可见时，可以重新发现并注入，而非永久记为“已经读过”。 |

工具选择存在需要辨别的细节：当前 `SessionSystemPrompt.render` 的 shell 指引仍偏向专用工具；`meta.txt` 也有专用文件工具优先规则。这些属于 OpenCode 自己的工具体验选择，并不构成“更灵活使用 shell”的直接依据。迁移到 DSH 时保留按实际能力渲染的机制，并按用户要求采用更开放的工具组合策略。

## 面向 DSH 的设计提炼

| 通用原则 | DSH 中的落实 |
| --- | --- |
| 对用户结果负责 | 明确目标、必要约束与验收依据，在有价值且获准的下一步仍存在时持续推进。 |
| 证据驱动的创造性 | 区分观察与假设；调整问题分解、表示方式、工具组合或实现路径，用小规模实验验证重要的不确定性。此处是综合设计，不声称是上游原句。 |
| 工具是可组合的能力 | 依据当前模式实际暴露的工具和 SDK 工作；shell、已有脚本、库与连接服务都可以参与方案。 |
| 方法失败与目标失败分开 | 失败说明当前尝试的结果；在判断真实阻碍前检查有依据的替代方案，并完成仍能独立推进的工作。 |
| 可检查的实现闭环 | 连贯实现、相关验证、检查实际产物，再交付有证据支持的结果。 |
| 稳定原则与动态事实分离 | 全局行为段提供通用策略，原生 DSH 继续提供模式、工具声明、权限与沙箱上下文。 |
| 持续协作与上下文恢复 | 保留目标、约束、已验证事实、被排除的假设和下一步；接收新消息后调整当前任务。 |

实现对应 [global-behavior.js](./global-behavior.js)，由根层 bundle 独立加载，适用于普通、Codex、PTC、计划模式与子智能体作用域；Codex 预设继续保留自身的工具专用指引。完整自定义 persona 的 `complete` 语义由 DSH 保留。不会把某种权限错误、某套系统管理命令或某个平台排障流程写进通用行为策略。

## 模型模板与渲染组件

[model-prompts.js](./model-prompts.js) 读取步骤捕获的模型路由，按精确模型标识从本机 Codex 缓存或 [打包快照](./prompts/openai-models.json) 选择基础模板。不存在精确模板时使用 [通用基础指令](./prompts/generic.md)。[prompt-renderer.js](./prompt-renderer.js) 参考 OpenCode 的按工具渲染和 override/append 机制，提供独立的渲染、组合和提示段变换服务。

渲染依据 DSH 公开的作用域与步骤工具投影，不修改工具注册或参数 schema。PTC 能力仍通过原 SDK 调用；原生 Shell 的后台作业与交互输入语义保持区分。只替换基础身份和已知默认 persona，保留专用角色、模式、权限和其他运行上下文。基础模板中的平台专用调用说明按实际能力适配，不把 Codex 的运行接口假装成 DSH 已注册工具。
