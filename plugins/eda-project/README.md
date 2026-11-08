# EDA 项目与脚本工具箱

按项目保存芯片设计的工艺库、时钟目标、功耗与 DFT 参数，并生成带不可变输入快照和 SHA-256 清单的 EDA 脚本。脚本生成不会启动 EDA，也不代表工具兼容性或签核。

## Innovus 后端入口

后端有两个互斥入口，由 `toolbox.backend.start_mode` 选择：

- `from_netlist`：配置真实综合网表、Tech/Cell/Macro LEF，并在 `mmmc_config` 中显式提供 Liberty Library Set、RC Corner、Constraint Mode/SDC、Delay Corner、Analysis View 与活动 Setup/Hold Views。`backendPhase=preflight` 只生成 readiness JSON/Markdown；`inventory` 生成 init_design 与宏实例盘点请求；`floorplan` 还要求经 LEF 核实的 Legacy Site、Core 宽高和 margins，并只导出待复核的候选 DEF。先检查宏 inventory、宏/Pin 规划、Core 参数与 Innovus 报告，再决定是否复用该 DEF。
- `from_existing_floorplan`：必须提供现有 MMMC Tcl 与 Floorplan DEF，然后生成完整的 import、floorplan、powerplan、placement、CTS、route 与 finish 脚本。

MMMC 配置使用项目源码根目录下的路径；RC 模型必须来自已确认的 PDK 数据，不得使用空文件或教学示例。SDC 模式不得根据端口名推断。项目仍需由目标 Innovus 检查 Liberty/LEF/RC/PVT 一致性、`init_design`、活动视图和 Floorplan；正式 DEF 还应在新会话恢复验证。floorplan DEF 不是完整数据库、PDN 或签核结果。

## Agent 工具

先通过 `eda_project_list` 获取 `projectId`，再使用 `eda_project_get` 查看当前项目；`eda_project_generate_flow` 可生成综合网表起点或现有 DEF 起点的 flow。执行时只使用返回的精确 Innovus run request，并检查报告；不能把预检、候选 DEF 或工具执行成功误作签核。宏布局使用 `eda_project_backend_layout` 与 `eda_project_floorplan_assist`，必须依据真实 inventory/LEF/DEF 数据。
