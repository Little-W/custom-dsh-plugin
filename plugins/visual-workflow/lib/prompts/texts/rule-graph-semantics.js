// src/host/prompts/texts/rule-graph-semantics.ts
//
// 规则文本 · **组织规划图语义（L1：图模型与硬规则）**
// 注入位置：wf_org_catalog 索引返回的 rules.graphSemantics（工具调用时按需注入）。
// 消费方：src/host/tools/wf-org-catalog/build.ts。
// 这份文本是插件自定义语义（模型猜不出、踩中即整批补丁原子失败），改它等于改写图规则。
export const RULE_GRAPH_SEMANTICS = `组织规划图语义：

一、节点种类（9 种，kind 字段为判据）
1. start：启动节点，流程起点；全图仅 1 个；只允许 flow-out 线；
2. end：结束节点，流程终点；全图至少 1 个；只允许 flow-in 线；
3. pause：暂停节点，运行到此流程暂停并等待恢复；入点 flow-in，出点 flow-out——两端都必须接线；
4. agent：子代理执行节点，承担可独立交付的任务；入点 flow-in / ctx-in / db-in，出点 flow-out；
5. parent：父代理节点，全局调度中枢，对子代理节点的执行进行监督管理，该节点默认存在，通常无需放到画布；scope=template 时可创建、编辑父代理及其连线以设计完整流程；scope=instance 时保护正在运行的父代理，补丁不可对其增删改或接线；
6. group：Team 节点，把多个成员节点包成一个团队；其内的成员可按需调度启动；入点 flow-in / ctx-in，出点 flow-out；
7. proxy：虚拟节点（主节点别名引用），无独立配置，只能引用角色节点（agent/parent），出入点配置同 agent 节点；流程可达性与环路按 proxySourceId 主角色计算，auto-ref-* 也不是独立执行节点，别名可以承接主角色的流程入线或出线；
8. task：任务节点——以文本描述任务，将 ctx-out 线连接 agent 节点 ctx-in 以启用；
9. database：数据库节点，必须配置路径或连接，将 db-out 线连接 agent 节点 db-in 以启用。

二、连线语义
1. flow（流程线）：节点执行顺序；可挂 condition 条件分支（{type:'pass'} / {type:'fail'}，text 型判断用 {type:'content', label}）；
2. ctx（上下文线）：该通道用于 task ctx-out → 角色 ctx-in 注入任务描述，以及 task → Team 节点 ctx-in 标注团队整体任务（供父代理读图理解，不注入成员）；
3. db（数据库线）：数据库 db-out → 角色 db-in 注入检索工具，连接的 agent 可按需检索数据库。

三、提交前自检
- 同一源节点同一流程出上的条件线必须**成对**：有「通过」（type:'pass'）就必须有「不通过」（type:'fail'）；
- 全图恰好 1 个 start；end 至少 1 个；阶段节点 label 不可自定义；
- Team 成员不得有流程线；成员节点的 groupId 与 Team 卡片的 memberIds 必须双向一致；Team 本身不可作为调度目标，需调度其内成员；
- 条件线只能 flow-out → flow-in；content 型条件必须带 label；

四、角色数量与重试参数（避免把运行参数误读成拓扑数量）
- agent 节点数量代表不同角色/职责或需要独立并行的工作单元；retryLimit、reactLimit、maxMembers 是运行参数，不会自动复制角色节点。
- 角色节点 data.retryLimit 是该节点处理**当前任务**的失败回流重试预算，默认 3，表示首次执行以外最多重试 3 次；同一角色处理新任务并成功结算后预算重置。用户说“一个 UI 设计工程师回流重试 5 次”，应创建/保留一个 UI 设计师 agent，并把它的 data.retryLimit 设为 5，通过失败/回流流程线再次调度该角色；不得创建五个相同工程师。
- data.reactLimit 是角色一次执行内部的 ReAct 迭代上限；它与 retryLimit（失败后重新执行任务）不同。不要用 role 节点数、Team memberIds 数量替代这两个上限。
`;
//# sourceMappingURL=rule-graph-semantics.js.map
