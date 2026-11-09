# OpenCode 模型服务

连接并管理 OpenCode 提供的 AI 模型，可在工作台查看模型列表、选择模型和调整参数。Claude 模型可通过工作台内置的兼容方式接入。网络中断后，工作台会尝试从当前进度继续；关闭此插件后，仍可使用工作台自带的模型服务。

支持通过已连接且获准直接令牌共享的 ChatGPT OAuth 调用 OpenAI `web_search`，供网页搜索插件使用。流式响应按输出项合并来源、引用与正文，兼容最后完成事件不携带输出的响应格式。仅在收到已完成的搜索调用后报告搜索结果；流中断、接口失败或未执行搜索时会明确报错。

模型响应流中的 body/header/connect 超时、HTTP 5xx、`server_is_overloaded`、断线和嵌套网络异常会按类型交给 DSH 原生重试机制，最多重试 5 次，使用可取消的指数退避；响应头为 HTTP 200 也不代表响应体已完整读取。用户取消、认证失败和无效请求不作为瞬时断线重试。失败流不会提交为已完成的助手消息，也不会重放先前已经完成的工具步骤。

在包目录执行 `npm run test:recovery`。真实桌面重试集成测试需要使用桌面端 Electron 的 Node 模式，并设置 `DSH_RETRY_TEST_ENTRY` 为该安装中 `@deepseek-ai/dsh-llm-retry/lib/index.js` 的路径。
