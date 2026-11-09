# Custom DSH 插件

面向官方 DSH `0.2.2-rc.1` 插件加载器的独立插件包。各服务端入口已打包为可直接加载的文件，不依赖 `@agent-studio/studio-core` 或其他 Agent Studio 私有运行时；前端资源也随插件提供。本仓库是插件源码与发布文件的唯一维护来源，Studio 的插件目录通过软链接引用本仓库的 `plugins/`；可视化工作流使用其独立发布构建产物。

仓库根目录本身可作为 OpenCode 模型服务插件安装；其他插件以独立包放在 `plugins/` 子目录中。可视化工作流插件随仓库发布在 `plugins/visual-workflow/`，不再依赖另一个 Git 仓库。

## 当前插件

- `plugins/blue-theme`：DeepSeek 蓝色主题，接入 DSH 官方主题服务。
- `plugins/dsh-codex`：按模型加载 OpenAI 原文模板或通用基础指令，按 DSH 工具渲染、替换或追加；支持全模式自主探索、持续执行和批量编辑，以及目录探测、SVG 查看和搜索容错。
- `plugins/eda-project`：EDA 项目设置和脚本工具箱。
- `plugins/eda-tools`：EDA MCP 工具与脚本执行服务。
- `plugins/batch-install`：从一个本地目录批量安装其中的 DSH 插件。
- `plugins/data-storage`：选择 DSH 数据目录，迁移数据，打包备份并恢复。
- `plugins/opencode-provider`：OpenCode 模型目录、提供商设置和模型调用。
- `plugins/visual-workflow`：可视化工作流设计、运行与断点续跑。
- `plugins/session-features`：保存任务与排队消息，支持暂停、继续、消息撤回和中断恢复；稳定合并思考组，并可隐藏全部思考气泡。
- `plugins/session-workspace-settings`：工作区目录和会话管理。
- `plugins/web-search`：可配置的网页搜索。
- `plugins/chrome-devtools`：接入 Chrome DevTools，提供页面检查、浏览器操作与截图工具。
- `plugins/plugin-preview`：真实手机/桌面浏览器模式，在加载 DSH 前配置 Chrome UA、触控与 DPR，核验状态并显示真实截图；支持布局视口与 UI 风格设计 skill。

仓库根目录提供 OpenCode 插件的 DSH 包入口，可直接通过 DSH 的插件安装界面添加本仓库。命令行安装时使用 `dsh plugin --profile <配置名> add -w git+ssh://git@github.com/Little-W/custom-dsh-plugin.git`。其他插件从 `plugins/<插件目录>` 单独安装，避免把无关功能一起启用。所有包都保留各自的 DSH manifest、界面资源和运行时依赖。

桌面端本地快速安装可运行 `node scripts/install-dsh-plugins.mjs`；脚本读取当前 Desktop 启动日志定位其 Electron、DSH 和 `app.asar`，随后调用 Desktop 自带的 generation 安装后端，将 Codex 与可视化工作流插件原子替换为仓库版本。这样旧 generation 会从当前投影中退出，不会再交给普通 pnpm 卸载。安装后需要重启 DSH Desktop 才会加载新模块。执行 `node scripts/install-dsh-plugins.mjs --dry-run` 可先查看版本计划。

除 OpenCode 模型提供商外，运行依赖仅为插件实际使用的官方 DSH 包。OpenCode 提供商的 OpenCode 2.2.5 与 Effect JavaScript 运行时代码已打包在插件入口中；插件清单只保留 DSH 官方接口及原生模块依赖，不需要另装 `@opencode/*`。仓库根包与 `plugins/opencode-provider` 使用相同版本号，便于 DSH 安装器直接按仓库入口安装该插件。
