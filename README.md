# Custom DSH 插件

这里汇总 Agent Studio 为 DSH 提供的外置插件包。当前插件构建目标为 DSH `0.2.2-rc.1`。

## 当前插件

| 插件 | 目录 | 说明 |
| --- | --- | --- |
| DeepSeek 蓝色主题 | `plugins/blue-theme` | 统一工作台主题 |
| EDA 项目管理 | `plugins/eda-project` | 项目参数、工艺库、工作目录和脚本生成 |
| EDA 工具 | `plugins/eda-tools` | 调用已配置的仿真、综合等 EDA 工具 |
| OpenCode 模型提供商 | `plugins/opencode-provider` | OpenCode 模型服务与模型选择 |
| 会话功能增加 | `plugins/session-features` | 会话暂停、继续和临时网络中断重试 |
| 会话与工作区设置 | `plugins/session-workspace-settings` | 工作区路径、会话工作目录和删除会话 |
| 网页搜索 | `plugins/web-search` | 可配置的网页搜索服务 |

旧版会话暂停插件保存在 `legacy/`，仅供迁移参考，不应与“会话功能增加”同时安装。

## 包结构

每个插件目录保留插件清单、Cordis 补丁、服务入口、中文界面文案以及构建好的客户端资源。部分服务入口引用 `@agent-studio/studio-core` 的共享实现；该依赖目前由 Agent Studio 工作区提供，尚未作为独立公共 npm 包发布。因此，这份仓库用于插件源码分发和版本归档，直接安装到未包含该共享依赖的 DSH 环境前，需要先提供对应的共享实现。
