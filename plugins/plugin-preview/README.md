# 插件页面预览

把本地已构建的 DSH 插件装进独立预览进程，沿用真实 DSH 的前端模块、主题、插槽、Host API 和原生浏览器认证。配合“Chrome 开发者工具”检查实际页面，避免用手工拼出的 HTML 代替插件在宿主内的渲染。

## 使用方式

在插件设置面板中填入插件包的绝对路径，每行一个，选择手机模式、桌面模式或仅布局视口，再选择设备与横竖屏，点击“启动预览”。支持紧凑手机 360×800、标准手机 390×844、大屏手机 430×932、平板 768×1024、桌面 1440×900 和自定义尺寸。也可以在任何智能体模式通过原生工具或 PTC SDK 调用 `plugin_preview`：

```json
{
  "action": "start",
  "plugin_paths": ["/path/to/custom-dsh-plugin/plugins/visual-workflow"],
  "copy_workflow_templates": true,
  "mode": "mobile",
  "viewport": { "preset": "phone", "orientation": "portrait" }
}
```

使用 Chrome 的 `new_page` 打开返回的 `loginUrl`，DSH 会把预览实例自己的启动 token 换成浏览器 cookie，随后重定向至干净地址。通过页面按钮进入目标插件，检查 DOM、控制台、交互并截图。工具名称应从当前可用工具中发现，不假设 MCP 前缀的拼写。

## 明确的手机模式与桌面模式

`mode="mobile"` 是真实 Chrome 手机模式。启用 Chrome 开发者工具插件后，预览插件通过 DSH 原生工具执行管线创建独立空白标签页，**先**设置 Android/Mobile UA、移动视口、DPR、触控、粗指针与无悬停行为，**再**加载 DSH 并完成认证。DSH 的 `isMobileDevice()` 根据 UA 判断手机行为，并缓存首次检测结果，因此仅调整尺寸，或先加载 DSH 再改 UA，都不足以验证手机模式。

工具会读取浏览器的实际尺寸、DPR、UA、触控点数、pointer/hover 媒体查询与 origin。全部匹配才返回 `browser.verified=true`、`emulationAppliedByTool=true`，并给出受控 Chrome 的 `pageId`。设置面板展示核验结果与真实浏览器截图；智能体继续使用同一 DSH Chrome 工具在该 `pageId` 上导航、点击和检查，之后调用 `capture` 刷新面板画面。

`mode="desktop"` 明确使用桌面 UA 与无触控环境；`mode="layout"` 只改变 CSS 布局视口。API 默认 layout 以兼容旧调用，GUI 默认手机模式。手机和桌面模式下，`start`、`reload` 和 `configure_view` 会自动配置 Chrome；Chrome 未启用、版本不支持指定 `pageId`、权限拒绝或状态核验失败时，面板明确显示“模式尚未启用”，不会降级后宣称手机模式成功。

```json
{"action":"configure_view","preview_id":"预览 id","mode":"mobile","viewport":{"preset":"phone","orientation":"landscape"}}
```

切换模式或视口会重新创建并配置受控标签页，预览 DSH 进程保持运行。失败后可用 `{"action":"open_browser","preview_id":"预览 id"}` 重试浏览器初始化；`{"action":"capture","preview_id":"预览 id"}` 只刷新已核验标签页的真实截图。所有 Chrome 调用保留智能体作用域、工具可见性、原生权限检查和取消信号，不直接绕过工具管线。关闭预览会关闭它自己创建的标签页。

自定义视口示例为 `{"preset":"custom","width":412,"height":915,"deviceScaleFactor":2.5}`；宽高为 240–4096 的整数 CSS 像素，DPR 为 0.5–4。手机模式强制启用 mobile/touch；桌面模式明确关闭它们。`reload` 保留模式和视口配置。

### 仅布局设备框

`devicePreviewUrl` 提供真实 DSH 的 CSS 视口设备框，支持旋转、宽高和缩放，适合手动检查布局。它不改变浏览器 UA 或触控能力，因此按钮明确标为“仅布局设备框”。普通页面链接同样不会自动启用手机模式。设备框与普通链接都不作为手机模式成功的证据。

手机模式验证的是移动网页及 DSH 的手机行为，不模拟原生 Android/Compose、系统键盘、浏览器系统栏或真实设备安全区。

## 随包提供的 UI 设计技能

包含 [`ui-style-design`](skills/ui-style-design/SKILL.md)，启用插件时注册到 DSH 原生技能服务，可在各模式通过技能工具发现和读取，停用插件时随之注销。它指导风格取舍、现有设计系统与 tokens 的复用、排版和图标对齐、工具栏状态切换、移动布局，以及通过真实页面进行验证。模型按任务加载技能正文，不把整个设计指南强行加入所有会话。

技能资源位于插件包内，安装和更新插件时一起交付，无需额外下载。兼容的 `agents/openai.yaml` 元数据同样随包提供。

修改后先运行该插件已有的构建步骤，再调用：

```json
{"action":"reload","preview_id":"上次返回的 id"}
```

重新打开新的 `loginUrl`。更新会产生新的预览 id、原生认证和产物哈希；`status` 返回每个插件的构建包哈希、客户端 SHA-256 和 `sourceChanged`。当 `sourceChanged=true` 时，当前预览仍是旧快照，需要更新。`list` 列出当前会话创建的预览，`stop` 关闭进程。默认 15 分钟自动关闭，可设置 60–3600 秒；DSH 卸载本插件、预览进程失去父进程时也会关闭。

## 隔离与权限

预览使用独立的 `DSH_HOME`、Profile、会话、数据目录、端口和认证。无需重启当前 DSH，不会复制生产会话、运行实例、账号凭据文件、调度任务或服务进程。可选的工作流模板快照只复制 `flow-templates/*.json`，清空结构化口令/令牌字段；模板正文仍是用户提供的文本。预览中的编辑只保存到副本。

这是数据和进程生命周期隔离，不是额外的操作系统沙箱。插件 Host 代码仍是本机代码；智能体启动/更新预览会调用与原生插件管理一致的 `approveEscalation`，遵守当前权限与审批，不修改会话权限模式。设置面板的操作来自已通过 DSH 认证的用户。管理 API 同样执行原生 Connection 认证和来源校验。

只使用本机现有 DSH 与依赖，不运行 `npx`、下载包或自动执行构建脚本。插件包须包含 `package.json`、`dsh.bundle.patch`、Host 入口和声明的客户端构建产物。依赖优先复用源码自己的 `node_modules`，否则使用当前 Profile 已安装的同名插件依赖；缺失时返回真实启动错误和日志路径。预览日志会隐去启动 token。

## 检查结果如何汇报

启动成功只证明预览实例可认证访问，工具会明确返回 `visualVerification=not-performed-by-this-tool`。模型仍须通过 Chrome 检查真实界面，区分“修改了源码”“构建成功”“安装了包”“运行进程已加载”“完成真实页面检查”。语法检查、`git diff --check`、读取已存在代码、手工样式预览不能替代这些证据。

在包目录运行 `node --test runtime.test.js` 可检查快照、版本、所有权、取消、日志、容量和认证失败处理。使用桌面端 Node/Electron 运行 `integration.test.js`，并将 `DSH_PREVIEW_TEST_ENTRY` 指向当前 DSH 的 `lib/bin.js`，可验证真实宿主和原生认证。
