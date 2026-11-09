# Chrome 开发者工具

通过 Chrome DevTools MCP 在 DSH 会话中操作浏览器，检查页面结构、控制页面交互、读取控制台和网络请求，并进行截图与性能分析。插件沿用 Codex 的启动参数：使用 `/usr/bin/chromium`、无界面运行、每个 MCP 进程使用独立临时浏览器配置、视口为 1440×900，并关闭将页面地址发送到 CrUX 的性能查询。

工具由 DSH 原生 MCP 客户端注册，名称以 `mcp__chrome_devtools__` 开头。首次启动需要通过 `npx` 下载 `chrome-devtools-mcp`；若启动暂时失败，MCP 客户端会保持 DSH 可用并按内置重连策略尝试恢复连接。

该配置针对 Linux Chromium。浏览器进程仅访问模型或用户明确要求操作的页面；不要在浏览器中输入或提交密码、验证码、支付信息等敏感数据。
