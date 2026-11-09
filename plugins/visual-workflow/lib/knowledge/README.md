# 知识积累组件（knowledge）

本组件让视觉工作流在**构建与运行过程中持续积累可复用知识**，并把知识反过来用于下一次构建：
自动创建 DSH 技能、记录已修复错误的现象/根因/修复/优化方向，并提供一套自迭代协议。

## 它解决什么问题

工作流构建中的经验通常散落在对话历史里：某套节点拓扑为什么这样连、某个提示词为什么必须加约束、
某次报错的根因是什么，下一次运行往往重新踩坑。本组件把这类经验变成两类可检索、可执行的资产：

| 知识类型 | 回答的问题 | 落盘形态 |
|---|---|---|
| `workflow_skill` | 这类工作流下次怎么构建/运行？ | 真实 DSH 技能：`$DSH_HOME/skills/<name>/SKILL.md` |
| `error_lesson` | 这次为什么错、下次怎么避免？ | JSON：`<dataDir>/knowledge/lessons/lesson-*.json` |

生成技能统一加 `wf-` 前缀，避免与用户手写技能或其它插件技能重名；同时在插件数据目录维护
`knowledge/skills-index.json` 保存技能元数据（正文仍以 `SKILL.md` 为唯一来源）。

## 两个模型侧工具

### `wf_knowledge_capture`

沉淀知识，按 `kind` 分派：

```jsonc
// 可复用的工作流技能
{
  "kind": "workflow_skill",
  "name": "parallel-review-pipeline",   // 自动归一为 wf-parallel-review-pipeline
  "description": "并行评审流水线：多评审者 + 汇总裁决",
  "whenToUse": "需要多个独立评审视角且必须给出统一结论时",
  "content": "## 适用场景 ...\n## 步骤 ...\n## 验收标准 ...\n## 反例 ...",
  "tags": ["review", "parallel"],
  "source": "content-review-flow"
}
```

```jsonc
// 已修复的错误教训
{
  "kind": "error_lesson",
  "problem": "节点子代理在第二轮丢失工具权限",
  "rootCause": "工具白名单在创建窗口之外安装，首轮后未重装",
  "resolution": "在 agent/created 创建窗口内安装 restrict，并在冷恢复时重装",
  "optimization": "把「创建窗口内安装」写进节点运行时技能的注意事项",
  "context": "DSH 0.2.x / subagent / combo 工具集",
  "severity": "high",
  "tags": ["subagent", "tool-filter"]
}
```

语义保证：

- 技能名归一为 lower-kebab-case 并自动加 `wf-`；超长/非法名字直接报错，不静默截断。
- 已存在且**不是本组件生成**的 `SKILL.md` 受保护：默认报 `WF_KNOWLEDGE_CONFLICT`，
  只有显式 `overwrite: true` 才覆盖。
- 教训 id 由 `problem + rootCause` 的 SHA-256 指纹决定；同一问题再次捕获会合并到同一文件并
  增加 `occurrences`，不会产生重复条目。
- 字段超预算报 `WF_KNOWLEDGE_VALIDATION`；参数形状错误报 `WF_KNOWLEDGE_BAD_ARGS`；
  文件系统失败报 `WF_KNOWLEDGE_IO`。
- 不写密钥、个人信息、一次性日志与未经验证的猜测。

### `wf_knowledge_recall`

```jsonc
{ "action": "guide" }                                  // 知识库概况 + 自迭代协议
{ "action": "recall", "query": "并行评审", "limit": 8 } // BM25 摘要检索
{ "action": "read", "ids": ["wf-parallel-review-pipeline", "lesson-0123456789abcdef"] }
```

- `guide` 返回计数、技能名、最近教训与分步协议；父代理在**规划前**与**收尾前**各调用一次。
- `recall` 用词法 BM25（拉丁词 + 中文二元组）排序，不依赖嵌入服务；省略 `query` 时按更新时间列出最近条目。
- `read` 按 id 读全文；未知 id 进入 `missing`，不会让整次调用失败。
- 工具只读，无副作用。

## 数据布局

```
<dataDir>/knowledge/
  skills-index.json          # 生成技能元数据（name/description/whenToUse/tags/时间/occurrences）
  lessons/
    lesson-<sha256-16>.json  # 教训本体 + 合并历史（最多 5 条）
$DSH_HOME/skills/
  wf-<name>/SKILL.md         # 真实 DSH 技能；frontmatter 含 name/description/whenToUse
```

`$DSH_HOME` 解析与官方 `@deepseek-ai/dsh-home-paths` 同口径：显式 `DSH_HOME` 优先，否则 `~/.dsh`。

## 装配方式

本组件是 `cordis.patch.yml` 中的一条独立 `insert` 行，因此会作为独立组件出现在
DSH 的「包含的组件」列表中，并可单独启停：

```yaml
- insert:
    - id: visual-workflow-knowledge
      name: dsh-visual-workflow/knowledge
      inject: [tools]
      config:
        dataDir: !!js dshHomePath('visual-workflow')
```

`package.json` 的 `exports` 提供 `./knowledge` → `lib/knowledge/index.js` 作为模块入口，
`dataDir` 与 visual-workflow 主组件同源。主组件入口不再用 `ctx.plugin` 挂载本组件，
避免同一工具被注册两次。

本组件声明 `inject: ['tools']`；`skills` 是可选服务，经 `ctx.inject(['skills'], ...)` 接入：

- 接入成功：已生成技能立即注册为运行期技能；每次 capture 后更新同名的运行期注册。
- 接入失败/缺失：知识仍落盘，技能文件由官方 skill-filesystem 在下一次刷新时发现。
- 组件卸载：两个工具与全部运行期技能随 fiber 撤销。

## 提示词接线

`knowledgeRuleOf(systemLanguage)` 的中英文正文集中在 `prompt.js`，被追加到：

- `buildOrchestratorPrompt`（纯编排父代理）
- `buildHybridPrompt`（编排 + 自执行父代理）
- `buildOrgPlanPrompt`（`/arrange` 规划期父代理）

追加发生在模板渲染之后，因此正文可以自由使用 Markdown 与工具名，不会与 `renderTemplate`
的 `{{...}}` 语法冲突。

## 文件职责

| 文件 | 职责 |
|---|---|
| `constants.js` | 知识类型、工具名、字段预算、错误码、路径与 DSH home 解析 |
| `prompt.js` | 常驻规则与自迭代指引（中英双语，纯函数） |
| `store.js` | 教训/索引/SKILL.md 的原子读写与进程内串行 |
| `service.js` | 校验、技能名归一、教训合并、BM25 检索、运行期技能注册 |
| `tool.js` | `wf_knowledge_capture` / `wf_knowledge_recall` 的 schema 与注册 |
| `index.js` | 独立组件入口与可选 skills 接入 |
| `locale/{en,zh}.json` | 组件在 DSH「包含的组件」列表中的名称与说明 |
| `icon.svg` | 组件列表中使用的独立图标 |

## 维护约束

- 新增知识类型时，必须同时更新 `KNOWLEDGE_KINDS`、工具 enum、`service.capture` 分派与检索投影；
  只改一处会让模型看到无法写入的枚举。
- 字段上限只在 `constants.js` 维护；工具描述里的数字从常量插值，不手写。
- 不要改用静默截断「修复」超限：模型会把截断后的内容误认为完整入库。
- 生成技能正文以 `SKILL.md` 为准，索引只存元数据；不要把正文复制进索引形成第二份真相。
