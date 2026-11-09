# AGENTS.md — lib/knowledge

本目录是视觉工作流的「知识积累」组件。修改前先读 `README.md` 与 `constants.js`。

## 不变量（违反即回归）

1. **技能名唯一规则**：所有生成技能必须 lower-kebab-case、以 `wf-` 开头、长度 ≤ `MAX_SKILL_NAME`。
   归一化只做「小写 + 非法字符转连字符 + 补前缀」，不做静默截断。
2. **用户文件保护**：目标 `SKILL.md` 存在且不在 `knowledge/skills-index.json` 中时，必须报
   `WF_KNOWLEDGE_CONFLICT`；只有显式 `overwrite: true` 才能覆盖。
3. **教训 id 确定性**：`lesson-<sha256(problem + rootCause) 前 16 位>`。同一现象+根因必须落到同一文件；
   合并时 `occurrences + 1`，不得新建重复条目。
4. **预算唯一来源**：所有字段上限/条数上限只在 `constants.js` 定义；`tool.js` 的说明必须从常量插值。
5. **正文唯一来源**：技能正文只在 `$DSH_HOME/skills/<name>/SKILL.md`；`skills-index.json` 只存元数据。
6. **提示词同源**：常驻规则与 guide 正文都在 `prompt.js`。不要分别改写 `prompts/parents.js` 或
   `prompts/planner.js` 里的文本。
7. **只读工具**：`wf_knowledge_recall` 不得写盘、不得注册技能、不得修改教训。
8. **失败可操作**：领域错误用 `WfError` 且消息以稳定错误码开头；IO 错误统一包成
   `WF_KNOWLEDGE_IO`。不要吞掉错误后返回成功。

## 修改检查清单

- 保持 `cordis.patch.yml` 中的 `visual-workflow-knowledge` 独立 insert 行、`package.json`
  的 `./knowledge` export 与本目录入口三者一致；不要在 `lib/index.js` 里重新用 `ctx.plugin`
  挂载本组件（会造成工具重复注册，且不再作为独立组件显示）。
- `node --check` 本目录所有 `.js`，以及被改动的 `lib/index.js`、`lib/prompts/*.js`、`lib/api/tool-descriptions.js`。
- 用临时 `dataDir` 与临时 `DSH_HOME` 跑一遍：capture skill → capture lesson → 重复 capture lesson
  （确认 `merged:true`、`occurrences:2`）→ recall → read → guide。
- 确认未覆盖用户手写技能：预先放一个同名 `SKILL.md`，capture 应报 `WF_KNOWLEDGE_CONFLICT`。
- 确认英文系统语言下 prompt/guide 走英文分支，中文走中文分支。
- 不新增对 `@deepseek-ai/*` 运行时包的依赖；服务一律经 `ctx.get()` / `ctx.inject()` 解析。
- 不把知识库状态写进工作流图或运行历史；知识库只依赖 `dataDir` 与可选 `skills` 服务。

## 常见改动

- **新增字段**：`constants.js` 加预算 → `service.js` 校验与归一 → `store.js` 若需持久化 →
  `tool.js` 参数说明 → `README.md`。教训/技能检索投影（`skillRow` / `lessonRow`）也要同步。
- **新增知识类型**：`KNOWLEDGE_KINDS` → capture 分派 → 存储目录/索引 → recall 投影 → 工具 enum。
- **调整提示词协议**：只改 `prompt.js` 的 `KNOWLEDGE_RULE_*` 或 `knowledgeGuideOf`，不要在
  `parents.js` / `planner.js` 里追加第二段规则。
