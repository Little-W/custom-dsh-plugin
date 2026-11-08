# 外置 DSH 插件

本目录中的插件面向官方 DSH `0.2.2-rc.1` 插件加载器。服务端入口已构建为独立文件，不引用 `@agent-studio/studio-core` 或其他 Agent Studio 包；前端资源也随包提供。

大多数插件只依赖 DSH 官方服务接口，相关官方包列为 peer dependency。OpenCode 模型提供商还需要 OpenCode 官方模型运行库（`@opencode/*`）和 `effect`，这些是该插件自己的公开运行时依赖。

- `blue-theme`：DeepSeek 蓝色主题，使用 DSH 官方主题令牌服务。
- `dsh-codex`：Codex 编程提示与 shell 优先流程，支持并行检查、目录浏览、SVG 图片查看和搜索容错。
- `batch-install`：扫描本地插件文件夹并一次安装全部有效插件。
- `eda-project`：EDA 项目设置和脚本工具箱。
- `eda-tools`：EDA MCP 工具与子进程服务。
- `opencode-provider`：OpenCode 模型提供商、目录和配置管理。
- `session-features`：保存 TodoList / TaskPlan 和子智能体进度，支持检查点恢复与临时网络故障重试。
- `session-mode-switcher`：在会话轮次结束后切换智能体模式，并保存选择以便恢复会话。
- `session-workspace-settings`：工作区目录和会话管理。
- `web-search`：可配置的网页搜索提供商。
