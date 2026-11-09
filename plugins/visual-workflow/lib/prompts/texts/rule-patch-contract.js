// src/host/prompts/texts/rule-patch-contract.ts
//
// 规则文本 · **写图契约**（提交规则 / op 字段形状 / 角色节点 data 契约）
// 注入位置：wf_org_catalog 索引返回的 rules.patchContract（唯一注入通道）。
// 其中 OP_FIELD_SHAPES 另被 wf_graph_patch 的参数层错误消息逐条引用（模型自我修正的主要通道）。
// 语言：中文（与其它按需返回的规则文本一致）；JSON 字段名 / 取值 / 工具名保留原样。
/** 单个补丁的 op 数上限（与 wf_graph_patch 的整体护栏同源；组织预算的 patchOpsMax 可能更小）。 */
export const PATCH_OPS_MAX = 200;
/**
 * 各图操作的**最小字段契约**（逐条模式）：键为 op 名，值为该 op 的形状说明。
 * 被参数层错误消息逐条引用，保证「报错说的」与「目录里写的」永远一致。
 */
export const OP_FIELD_SHAPES = {
    create_node: "{ op:'create_node', node:{ kind:'agent'|'parent'|'start'|'end'|'pause'|'group'|'subgraph'|'proxy'|'task'|'step'|'database', id?:string, data?:{...} } }（节点字段必须写在 node 内，不得平铺到 op 上；各 kind 的 data 字段按下方“节点字段说明”；proxySourceId 是 proxy 节点顶层字段；position 不接受，系统自动布局；subgraph 的 data.graph 内含 nodes/lines，必须恰一个 start、至少一个 end）",
    remove_node: "{ op:'remove_node', nodeId:string, cascade?:boolean }（cascade 缺省 true：引用它的 proxy 节点一并删除；关联连线始终删除）",
    update_node_data: "{ op:'update_node_data', nodeId:string, data:{...} }（浅合并；Team 卡片更新会保留既有成员清单，成员关系仍只能经 set_group_members 维护）",
    connect: "{ op:'connect', source:string, target:string, sourceHandle?:'flow-out'|'ctx-out'|'db-out', targetHandle?:'flow-in'|'ctx-in'|'db-in', condition?:{ type:'pass'|'fail'|'content', label?:string } }（端点字段名为 source/target；省略 handle 时按 flow-out -> flow-in 补全流程通道，ctx/db 通道必须显式写 handle）",
    disconnect: "{ op:'disconnect', lineId:string } 或 { op:'disconnect', key:{ source,target,sourceHandle,targetHandle } }",
    create_group: "{ op:'create_group', groupId:string, label?:string, collabPrompt?:string, memberIds?:string[] }（label 缺省取 groupId）",
    set_group_members: "{ op:'set_group_members', groupId:string, memberIds:string[] }（memberIds 必填；省略它不会清空成员）",
};
/** 图结构组的全部 op 形状（一段可整体引用的文本）。 */
export const GRAPH_OP_FIELD_TEXT = [
    `create_node ${OP_FIELD_SHAPES.create_node}`,
    `remove_node ${OP_FIELD_SHAPES.remove_node}`,
    `update_node_data ${OP_FIELD_SHAPES.update_node_data}`,
    `connect ${OP_FIELD_SHAPES.connect}`,
    `disconnect ${OP_FIELD_SHAPES.disconnect}`,
    `create_group ${OP_FIELD_SHAPES.create_group}`,
    `set_group_members ${OP_FIELD_SHAPES.set_group_members}`,
].join('；');
/**
 * 角色节点（agent / parent）的 data 字段契约。
 * 为什么必须显式写清 presetId：它为空意味着该节点运行期**零工具**（连读写文件都调不到），
 * 而图检查器只以告警提示，不会阻断——这条契约是模型唯一能提前避开该坑的地方。
 */
export const ROLE_NODE_DATA_CONTRACT = [
    "角色节点（kind='agent'|'parent'）的 data 字段：",
    '优先复用已有角色：只写 roleAssetId（取值 role-* / flow-*#<节点id> / instance#<节点id>），系统自动带入 systemPrompt / presetId / provider / model / reasoning / inputSchema / outputSchema，显式 data 字段覆盖带入值，并在节点上登记 data.sourceAssetId；无合适角色时才手写下面的配置；',
    'label：人类可读名称；使用 roleAssetId 时取角色名，手写时缺省回退节点 id；',
    'systemPrompt：未使用 roleAssetId 时必须填写该子代理完整的角色职责提示词；',
    'presetId：未使用 roleAssetId 时必须填写，取自工具组合 id 或官方 preset id；为空表示该节点运行期零工具（连读写文件都做不到）；',
    'provider + model：未使用 roleAssetId 时结合任务复杂度按需填写；必须成对复制模型目录中的两列——model 内的 "org/" 前缀属于 model 本身，不属于 provider；留空则回退宿主默认；',
    'reasoning?（思考强度，结合任务复杂度填写合适值）；inputSchema?（输入契约：该节点应当收到什么）；',
    'outputSchema?（输出契约：该节点最终回复必须如何组织；新建 agent 节点省略时写入默认契约文本，parent 不参与节点交接，update 省略即保持现值）。',
    'loopLimit?（仅通过性校验角色使用的内部循环上限）；不要把它当成回流重试次数。',
    'retryLimit?（回流重试上限，默认 3）：这是该角色节点针对同一任务在收到失败/退回反馈后的最大重试次数，不含首次执行；只配置一个角色节点并通过 fail/回流连线重复执行它。数值 N 表示同一节点最多重试 N 次，绝不表示创建 N 个副本、N 个 agent 或 N 个并行成员；节点数量只按不同职责/并行任务决定。',
    'reactLimit（ReAct 内部迭代上限，null 表示不设限）与 retryLimit 不同：它约束单次调用内部的 ReAct 循环，不代表反馈回流次数或节点副本数；此字段由系统/用户设置，父代理的写图补丁不能创建或覆盖它，更新时保持当前值。',
    '可选角色字段：groupId?（所属 Team id）；promptFilePath（系统管理的宿主提示词文件路径，父代理补丁不能设置）；systemPromptSource?（提示词来源文件名，仅展示）；injectSystemPrompt / injectToolSections（系统管理的提示词段注入开关，父代理补丁不能设置）；这些字段不是任务正文或节点数量参数。',
].join('\n');
/** 非角色节点的 data 字段契约；显式列出规范字段，避免把任务正文、界面名称与角色提示词混淆。 */
export const OTHER_NODE_DATA_CONTRACT = [
    "节点字段说明（create_node.node.data / update_node_data.data；通用字段只适用于对应 kind）：",
    "- kind='task'（前置任务提示词节点）：label（节点名称）；content（任务正文，实际注入下游角色的内容）。要写任务正文必须写 data.content；label 有值不代表 content 有值。",
    "- kind='step'（流程中的过程提示词节点）：label（节点名称）；content（过程提示词正文，注入后续角色）。它沿 flow 顺序执行，不是独立 agent。",
    "- kind='group'（Team 容器）：label（团队名）；collabPrompt（成员协作说明，追加到成员任务上下文）；memberIds（成员 agent 节点 id 数组）；dynamic?（是否允许运行期动态招募成员）；maxMembers?（动态团队人数上限）；memberRolePrompt?（动态成员的职责模板）；size?（{w,h}，仅卡片尺寸）。只有确需多个不同职责并行协作时才创建多个成员；回流次数由成员角色节点自己的 retryLimit 控制。",
    "- kind='database'：label（名称）；description（用途说明）；dbType='local'|'server'；dbKind='sqlite'|'mysql'|'postgresql'；localPath（本地库路径）；conn（服务器连接 {host,port,user,password,db}）；vectorSource='embedding'|'bm25'；vectorOptions?（topK, chunkSize, overlap, scoreThreshold, maxRows）。只填写与所选 dbType 相符的连接字段；不要把密钥写进提示词。",
    "- kind='start'|'end'|'pause'：只允许 data.label（阶段名称由系统锁定）；不添加 prompt/content。",
    "- kind='proxy'：proxySourceId 必须位于 node 顶层，引用一个既有 agent/parent 主节点；proxy 只有可选 data.label / data.autoLayoutReference 视图字段，不创建独立代理实例。",
    "- kind='subgraph'：data.label；data.description?（说明）；data.graph={nodes,lines}（内联完整子流程，恰一个 start、至少一个 end，不能再嵌 subgraph）；data.sourceTemplateId? 仅记录导入来源。",
    "所有节点共同字段：node.id?（稳定且唯一，建议显式给出便于连线）；node.kind（必填）；node.data（按 kind）；node.position 不可传入，服务端忽略/拒绝并由自动布局生成。",
    "内容读取与写入核验：工具调用参数是待写入值，不是当前已保存内容的证据；补丁成功只证明所提交操作已保存并返回新 revision，不证明未修改字段或其他节点有内容。读取工作流/资产时按返回对象的 kind、id、nodeId 与字段原值判断：task/step 看 data.content（目录详情呈现为节点 content），角色看 data.systemPrompt（目录详情通过 inlineRoles 的 systemPrompt 单独返回）。空串就是空内容；不得用 label、summary、description、补丁入参或其他节点的正文推断该字段已有内容。",
].join('\n');
/** 提交规则：一次补丁怎么组织、哪些形态会被拒绝。 */
export const PATCH_SUBMISSION_RULES = [
    '提交规则：',
    '0. 先用 wf_graph_patch({action:"read",scope:"template",targetId:"tpl-...",includePrompts:true}) 读取正在编辑的模板；运行实例用 scope:"instance"。省略 ops/create；返回 readOnly:true、applied:0、当前 revision、graph 和 diagnostics（既有问题、别名映射与流程可达节点）。graph 保留完整 nodes/lines 与 task/step 的 content；includePrompts:true 时含角色 systemPrompt。资产库目录中的 flow-* 不是当前 tpl-* 模板，不能代替读回。',
    '1. 补丁是原子的：任一 op 失败则全部不落盘——须一次性修完所有报错并整批重发；',
    '2. op 按数组顺序生效：同一批补丁内先建节点、再连线；',
    `3. 单个补丁最多 ${PATCH_OPS_MAX} 个 op；更大的改动拆成多批提交；`,
    '4. scope=template 改工作流模板（规划期），scope=instance 改实例（运行期）；',
    '5. create 新建模板（仅 scope=template），与 expectRevision 互斥；',
    '6. expectRevision 是乐观锁：不匹配即拒绝且不自动重试——请基于最新拓扑重发；',
    '7. legacy 图宽容只放行同一位置、同一明细的既有问题；不能因为存在同名 error code 就新增另一个问题。既有问题仍在 warnings 中透出；',
    '8. 失败后的拓扑仍是补丁之前的已保存版本；失败批次里创建的节点、连线均不存在，不需要撤销，也不能据失败入参猜测已保存内容。删除节点可能已级联移除连线，后续不要再 disconnect 该连线。遇到不存在/重复 id 时用同一工具 action:"read" 读取该 scope/targetId；只修改职责/提示词时不要顺带重建拓扑。',
    '9. 失败回流可直接连接审查角色到同一个祖先 agent：condition.type="fail"，目标角色 data.retryLimit 是有限非负整数，审查角色另有 pass 路径到 end；其余前向流程保持无环。回流预算独立记账，设计师本轮成功输出不能重置复审失败次数，暂停/重启续跑继承预算；预算用尽应走失败结束/暂停分支并汇报。不要复制 N 个角色表示 N 次回流，也不要把普通环改成 content/pass 条件来规避检查。',
    '10. proxy 是主角色的画布别名：经过 proxy 的流程入线/出线均归属 proxySourceId 角色。包括 auto-ref-* 在内的别名不能当成新 agent，也不需要为了通过检查器重复给主角色接线。ctx/db 通道不驱动流程；真正的孤岛必须在同一补丁内接好预期的上游/下游，不要为消除报错擅自删除任务角色。',
    '11. 较复杂的改线先用 wf_graph_patch({action:"validate",scope:"template",targetId:"tpl-...",expectRevision:当前版本,ops:[...]}) 做不写盘校验。它执行与 apply 一样的校验，返回 readOnly:true、validated:true、applied:0、proposedOps 与提案 diagnostics；这是未保存的提案，不得声称修改完成。通过后用相同 ops/expectRevision 提交 action:"apply"；若画布版本已变，重新读取并调整。改线、接入新节点与条件分支应整批提交，避免先拆断流程再用下一次调用接回。',
].join('\n');
/**
 * 写图契约全文（wf_org_catalog 的 rules.patchContract 直接引用这一段）。
 * 顺序即阅读顺序：先怎么提交，再各 op 形状，最后角色节点 data 契约。
 */
export const PATCH_CONTRACT_TEXT = [
    PATCH_SUBMISSION_RULES,
    '',
    `图操作字段形状：${GRAPH_OP_FIELD_TEXT}`,
    '',
    OTHER_NODE_DATA_CONTRACT,
    '',
    ROLE_NODE_DATA_CONTRACT,
].join('\n');
//# sourceMappingURL=rule-patch-contract.js.map
