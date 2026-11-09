# 外置 DSH 插件

本目录中的插件面向官方 DSH `0.2.2-rc.1` 插件加载器。服务端入口已构建为独立文件，不引用 `@agent-studio/studio-core` 或其他 Agent Studio 包；前端资源也随包提供。

各插件通过 DSH 官方服务接口接入宿主，并随包提供前端资源。OpenCode 模型提供商已将 OpenCode 与 Effect 运行时代码打包进入口，实际外部依赖以各插件的 package.json 为准。

- `blue-theme`：DeepSeek 蓝色主题，使用 DSH 官方主题令牌服务。
- `dsh-codex`：按模型加载 OpenAI 原文模板或通用基础指令，按 DSH 工具渲染、替换或追加；支持全模式自主探索、持续执行和批量编辑，以及限量目录列表、SVG 查看和搜索容错。
- `batch-install`：扫描本地插件文件夹并一次安装全部有效插件。
- `eda-project`：EDA 项目设置和脚本工具箱。
- `eda-tools`：EDA MCP 工具与子进程服务。
- `opencode-provider`：OpenCode 模型提供商、目录和配置管理。
- `session-features`：保存任务与排队消息，支持暂停、继续、消息撤回和中断恢复；稳定合并思考组，并可隐藏全部思考气泡。
- `session-mode-switcher`：在会话轮次结束后切换智能体模式，并保存选择以便恢复会话。
- `session-workspace-settings`：工作区目录和会话管理。
- `web-search`：可配置的网页搜索提供商。
- `chrome-devtools`：接入 Chrome DevTools，提供页面检查、浏览器操作与截图工具。
- `plugin-preview`：明确的手机/桌面模式，自动配置并核验 Chrome UA、触控、DPR 和移动视口，展示真实画面；支持布局设备框与 UI 风格设计 skill。
