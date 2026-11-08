# Migration from `i2c_tb` to the generic UVM template

## Kept (reusable engineering pattern)

| Source concept | Generic template location |
|---|---|
| Single testbench top with clock/reset and `run_test()` | `tb/__PREFIX___tb.sv` |
| Virtual interface via `uvm_config_db` | `tb/__PREFIX___tb.sv`, `env/__PREFIX___env_pkg.sv` |
| Standard UVM agent skeleton | `env/agent/*` |
| One env + virtual sequencer | `env/__PREFIX___env_pkg.sv`, `env/__PREFIX___vir_sqr.sv` |
| Base test creating env | `seq_lib/__PREFIX___base_test.sv` |
| One `+SEQ`-driven smoke test | `seq_lib/__PREFIX___smoke_test.sv` |
| Base virtual sequence with reset wait and bus helpers | `seq_lib/common/base_virt_seq.sv` |
| Case description in `.tc` file | `test_lib/smoke/smoke.tc` |
| VCS compile filelists | `vcs_com/*.f`, `vcs_com/vcs_com` |
| Optional SVA bind/checker | `tb/bind/*` (adapt/enable manually) |

## Removed (i2c/DUT/vendor-specific)

- `MCU_I2C_WRAPPER` DUT and all I2C pad/open-drain bridge logic
- I2C register model, I2C address/data NACK cases, speed-mode sequences
- APB/AXI/AHB/I2C SVT VIP environments, vendor `+incdir` absolute paths
- `bms`/`fe_bms` run scripts, EDA reports, `__pycache__`
- I2C-specific `.tc` plusargs (`I2C_TARGET_ADDR`, `I2C_SPEED_MODE`, ...)

## Reintroducing a VIP

1. Put the VIP adapter package under `env/vip/`.
2. Add a `vip_stub_pkg.sv`-style import boundary so the base environment compiles
   with `+define+USE_VIP` both on and off.
3. Extend `<prefix>_base_test` with VIP config creation and sequencer handles.
4. Expose VIP sequencers through `<prefix>_vir_sqr.sv` and the base virtual
   sequence, exactly as the i2c source did with `apb_vip_sqr_m0` / `i2c_vip_*`.
5. Keep vendor paths in `vcs_com/vip.f` only; never hard-code them in RTL or
   reusable TB source.

## Non-negotiable verification rules

- The template is a **scaffold**, not evidence of a working DUT.
- A pass requires: compile log, elaboration log, simulation log, test result,
  and explicit checks (scoreboard/assertions/register readback).
- Reset, clock, and bus protocol must be implemented explicitly; no "assume
  ready" loops without a timeout.
- Keep `.tc` files declarative; do not hide test intent in shell scripts.
