# Codex 模型基础指令原文导出

来源：`/home/yusen/.codex/models_cache.json`；缓存时间：`2026-11-08T16:01:45.779948200Z`；缓存客户端版本：`0.162.0`。

配置中的默认模型：`gpt-6-luna`。这表示配置默认值，不据此判定某个已经运行的会话实际使用的模型。

每个模型文件原样保存 `model_messages.instructions_template`，不添加标题或改写正文。[index.json](./index.json) 保存各模型的 UTF-8 字节数和 SHA-256，用于核对原文。未导出账户身份字段或认证材料。

| 模型 | 原文文件 | 字节数 |
| --- | --- | --- |
| `gpt-6.1-sol` | [gpt-6.1-sol.md](./gpt-6.1-sol.md) | 21534 |
| `gpt-6-astra` | [gpt-6-astra.md](./gpt-6-astra.md) | 21183 |
| `gpt-6.1-terra` | [gpt-6.1-terra.md](./gpt-6.1-terra.md) | 21183 |
| `gpt-6-sol` | [gpt-6-sol.md](./gpt-6-sol.md) | 18754 |
| `gpt-reserve` | [gpt-reserve.md](./gpt-reserve.md) | 17766 |
| `gpt-6-luna` | [gpt-6-luna.md](./gpt-6-luna.md) | 17799 |
| `gpt-5.6-sol` | [gpt-5.6-sol.md](./gpt-5.6-sol.md) | 17766 |
| `gpt-5.6-terra` | [gpt-5.6-terra.md](./gpt-5.6-terra.md) | 17766 |
| `gpt-5.6-luna` | [gpt-5.6-luna.md](./gpt-5.6-luna.md) | 17766 |
| `codex-auto-review` | [codex-auto-review.md](./codex-auto-review.md) | 17766 |

这些是缓存中的模型基础指令。运行时还可能有显式配置覆盖，以及按模式、工具、AGENTS.md、环境和权限状态追加的消息。因此该目录不代表某个会话的完整最终输入。

本次读取的顶层配置 未设置 `model_instructions_file`，未发现 `base_instructions` 字段。源码中 `base_instructions` 的优先级仍高于模型元数据；CLI 或会话单独覆盖需另行核对。

读取路径与字面模板解析逻辑见 `openai-codex/codex-rs/prompts/src/model_instructions.rs`、`codex-rs/prompts/src/model_messages.rs`，配置覆盖逻辑见 `codex-rs/models-manager/src/model_info.rs`。
