---
name: uvm-environment-template
description: 根据 DUT 接口和 SPEC 创建、适配和检查通用 UVM 验证环境。
whenToUse: 用户要求搭建 UVM testbench、验证环境脚手架，或将已有设计适配到 UVM 环境时使用。
metadata:
  owner: EDA 工具
  template: framework/uvm_template
---

# 通用 UVM 验证环境

本 Skill 随 EDA 工具插件安装，通用框架也随插件一同安装。当前已安装的模板绝对路径为：

```text
{{UVM_TEMPLATE_ROOT}}
```

模板不包含 DUT、UVM 运行库或商业仿真器。

## 适用范围

适用于用户要求创建 UVM 环境、迁移 testbench、生成通用验证脚手架，且有 DUT RTL 或明确要求只生成模板的场景。若接口协议、DUT 端口、时钟复位或仿真器版本未知，不要猜测；在交付记录中标注待确认内容。

该框架提供通用 valid/ready 总线示例、transaction、sequencer、driver、monitor、agent、env、virtual sequencer、基础测试和 smoke sequence。它是可适配的脚手架，不是现成的协议 VIP 或可直接验证任意 DUT 的完整环境。

## 生成模板

在目标项目目录中执行随插件安装的生成脚本：

```bash
python3 {{UVM_TEMPLATE_ROOT}}/scripts/instantiate.py \
  --dest <workdir>/<dut>_tb \
  --prefix <snake_case_dut> \
  --dut-top <DUT_TOP> \
  --clock <clock> \
  --reset <reset> \
  --clock-period-ns <period>
```

生成脚本会复制并替换模板占位符，输出需结合实际 DUT 完成的修改清单。不要覆盖非空目标目录，除非用户明确要求覆盖。

## 适配要求

1. 根据真实接口改写 `tb/<prefix>_if.sv`、`tb/<prefix>_tb.sv`，补齐 DUT 实例端口和 tie-off。
2. 在 driver 中实现真实协议驱动，在 monitor 中采样真实握手和数据；只有 driver 可以驱动 DUT 引脚。
3. 按冻结的 SPEC 增加 reference model/scoreboard、断言和功能覆盖率。transaction 被接受不代表 DUT 正确。
4. 用真实 RTL filelist 更新 `vcs_com/rtl.f`，并确认 UVM 版本、仿真器和 VIP 可用性。
5. 检查生成目录无残留 `__PREFIX__`、`__DUT_TOP__` 等占位符。

详细文件契约、验证检查表和模板来源说明见 `references/template-contract.md`、`references/verification-checklist.md` 与 `references/i2c-extraction-notes.md`。

## 编译与验证

模板中的 Makefile 使用 VCS 示例命令；只有当项目确实配置了 VCS/UVM 时才运行。也可以使用项目实际配置的仿真器命令。必须保留真实编译和仿真日志，确认至少有一项 SPEC 对应的检查真正执行，并报告实际 exit code、UVM_ERROR/UVM_FATAL 及 scoreboard 结果。

模板自带的验证记录只说明通用骨架曾使用临时 stub 验证过生成和结构，不代表当前 DUT 已通过验证。没有真实 DUT 的编译、仿真和功能检查证据时，不得报告 UVM PASS。

## 限制

- 插件仅打包框架模板和 Skill，不随包分发 Accellera UVM 源码、Verilator/VCS 可执行文件、许可证或 DUT/IP/VIP 源码。
- 编译运行需要用户项目中可用的仿真器、匹配版本的 UVM 库、环境变量和许可证。
- 模板不提供完整功能覆盖率 closure、四态语义保证或验证签核。

## 资源

- `framework/uvm_template/`：可实例化的 SystemVerilog 骨架、生成脚本、Makefile 和文件列表示例。
- `references/`：占位符契约、验证检查表及模板来源记录。
