# Custom DSH 插件

面向官方 DSH `0.2.2-rc.1` 插件加载器的独立插件包。各服务端入口已打包为可直接加载的文件，不依赖 `@agent-studio/studio-core` 或其他 Agent Studio 私有运行时；前端资源也随插件提供。Studio 的插件目录会同步到本仓库；可视化工作流使用其独立发布构建产物。

仓库根目录本身可作为 OpenCode 模型服务插件安装；其他插件以独立包放在 `plugins/` 子目录中。可视化工作流插件随仓库发布在 `plugins/visual-workflow/`，不再依赖另一个 Git 仓库。

## 当前插件

- `plugins/blue-theme`：DeepSeek 蓝色主题，接入 DSH 官方主题服务。
- `plugins/dsh-codex`：Codex 风格的 shell 优先工作模式，先核实路径再读取，并提供目录探测、SVG 查看和搜索容错。
- `plugins/eda-project`：EDA 项目设置和脚本工具箱。
- `plugins/eda-tools`：EDA MCP 工具与脚本执行服务。
- `plugins/batch-install`：从一个本地目录批量安装其中的 DSH 插件。
- `plugins/data-storage`：选择 DSH 数据目录，迁移数据，打包备份并恢复。
- `plugins/opencode-provider`：OpenCode 模型目录、提供商设置和模型调用。
- `plugins/visual-workflow`：可视化工作流设计、运行与断点续跑。
- `plugins/session-features`：保存任务清单与子智能体进度，支持从检查点继续暂停或中断的会话。
- `plugins/session-workspace-settings`：工作区目录和会话管理。
- `plugins/web-search`：可配置的网页搜索。

仓库根目录提供 OpenCode 插件的 DSH 包入口，可直接通过 DSH 的插件安装界面添加本仓库。命令行安装时使用 `dsh plugin --profile <配置名> add -w git+ssh://git@github.com/Little-W/custom-dsh-plugin.git`。其他插件从 `plugins/<插件目录>` 单独安装，避免把无关功能一起启用。所有包都保留各自的 DSH manifest、界面资源和运行时依赖。

除 OpenCode 模型提供商外，运行依赖仅为插件实际使用的官方 DSH 包。OpenCode 提供商的 OpenCode 2.2.5 与 Effect JavaScript 运行时代码已打包在插件入口中；插件清单只保留 DSH 官方接口及原生模块依赖，不需要另装 `@opencode/*`。仓库根包与 `plugins/opencode-provider` 使用相同版本号，便于 DSH 安装器直接按仓库入口安装该插件。
