# Custom DSH 插件

面向官方 DSH `0.2.2-rc.1` 插件加载器的独立插件包。各服务端入口已打包为可直接加载的文件，不依赖 `@agent-studio/studio-core` 或其他 Agent Studio 私有运行时；前端资源也随插件提供。Studio 使用的插件目录与本仓库发布包保持一致。

## 当前插件

- `plugins/blue-theme`：DeepSeek 蓝色主题，接入 DSH 官方主题服务。
- `plugins/eda-project`：EDA 项目设置和脚本工具箱。
- `plugins/eda-tools`：EDA MCP 工具与脚本执行服务。
- `plugins/opencode-provider`：OpenCode 模型目录、提供商设置和模型调用。
- `plugins/session-features`：会话暂停、继续与临时网络中断自动重试。
- `plugins/session-workspace-settings`：工作区目录和会话管理。
- `plugins/web-search`：可配置的网页搜索。

旧版会话插件保存在 `legacy/`，仅用于迁移参考，不应与新版“会话功能增加”同时启用。

除 OpenCode 模型提供商外，运行依赖仅为插件实际使用的官方 DSH 包。OpenCode 提供商的 OpenCode 2.2.5 与 Effect JavaScript 运行时代码已打包在插件入口中；插件清单只保留 DSH 官方接口及原生模块依赖，不需要另装 `@opencode/*`。
