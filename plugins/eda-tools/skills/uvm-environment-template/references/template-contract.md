# Template contract

## Placeholders

| Token | Replaced with | Validated |
|---|---|---|
| `__PREFIX__` | snake_case DUT prefix | `[a-z][a-z0-9_]*` |
| `__DUT_TOP__` | DUT top module | Verilog identifier |
| `__TB_TOP__` | testbench top | Verilog identifier; default `<prefix>_tb` |
| `__CLOCK__` | clock signal/port | Verilog identifier |
| `__RESET__` | active-low reset signal/port | Verilog identifier |
| `__CLOCK_PERIOD_NS__` | clock period in ns | positive number |

## Generated hierarchy

```text
<dest>/
  tb/<prefix>_if.sv
  tb/<prefix>_tb.sv
  tb/bind/<prefix>_bind*.sv       # optional, disabled by default
  env/agent/<prefix>_{item,sequencer,driver,monitor,agent}.sv
  env/agent/<prefix>_agent_pkg.sv
  env/<prefix>_{env_pkg,vir_sqr}.sv
  env/vip/vip_stub_pkg.sv          # optional VIP boundary
  seq_lib/common/{common_seq_pkg,base_virt_seq}.sv
  seq_lib/<prefix>_seq/<prefix>_{seq_pkg,smoke_seq}.sv
  seq_lib/<prefix>_{base_test,smoke_test,test_pkg}.sv
  test_lib/smoke/smoke.tc
  vcs_com/{vcs_com,verif.f,vip.f,rtl.f}
  Makefile
  scripts/{instantiate.py,run_case.sh}
  docs/MIGRATION_FROM_I2C.md
```

## Compile order

`verif.f` follows:

```text
agent pkg -> env pkg -> common seq pkg -> sequence pkg -> test pkg -> interface -> tb top
```

Keep this order when adding packages; a new package that references
`<prefix>_env` must come after `env_pkg`.

## Hand-edit ownership

- The generated TB is user-owned; the template is read-only reference.
- DUT-facing files (`_if`, `_tb`, `_driver`, `_monitor`) are expected to change.
- Keep `_item`, `_sequencer`, `_agent`, env, base test, base virtual sequence
  generic unless the DUT needs a different transaction model.
- Add VIP adapters only under `env/vip/`; do not leak vendor types into
  `env/agent/` or `seq_lib/common/`.
