# Generic UVM Verification Environment Template

This directory is a **DUT/protocol-agnostic UVM scaffold**, extracted from a
legacy I2C testbench and stripped of all I2C, APB, AXI, AHB, SVT VIP,
register-model, and vendor-specific content.

It keeps the reusable engineering pattern:

```text
test_lib/<case>.tc  ->  +UVM_TESTNAME=... +SEQ=...
                          one smoke test -> sequence selected by +SEQ
                          virtual sequence / virtual sequencer
                            -> agent sequence/sequencer -> driver -> DUT
                            -> monitor/analysis port -> checker
```

The virtual sequence submits transaction items through the virtual sequencer;
only the driver owns pin-level protocol. After adapting the generic bus to the
real DUT, add SPEC-driven scoreboard/reference checks, functional coverage and
assertions. Sequences must not drive interface pins directly.


## What is generic

- Top testbench shell and clock/reset generation
- Generic valid/ready register-bus interface
- UVM item / sequencer / driver / monitor / agent / env / virtual sequencer
- One base test plus a `+SEQ`-driven smoke test
- Base virtual sequence with clock/reset wait and transaction-level read/write helpers routed through the virtual sequencer and agent sequencer
- Example smoke sequence
- VCS filelists, compile/run Makefile, case launcher
- Optional bind/checker and VIP adapter placeholders

## What is intentionally NOT included

- I2C DUT `MCU_I2C_WRAPPER`, open-drain bridge, I2C register map, I2C speed modes
- APB/AXI/AHB/I2C SVT VIP environments, sequences, and vendor paths
- Any i2c-specific test case, sequence, register model, `bms` script, or generated report
- Any confidential DUT RTL or simulator license setup

## Placeholders

| Token | Meaning | Example |
|---|---|---|
| `__PREFIX__` | snake_case block/class prefix | `my_ip` |
| `__DUT_TOP__` | DUT top module name | `my_ip_top` |
| `__TB_TOP__` | testbench top module | `my_ip_tb` |
| `__CLOCK__` | clock port on interface | `clk` |
| `__RESET__` | active-low reset port | `rst_n` |
| `__CLOCK_PERIOD_NS__` | clock period in ns | `10` |

## Create an environment

```bash
python3 scripts/instantiate.py \
  --dest verif/my_ip_tb \
  --prefix my_ip \
  --dut-top my_ip_top \
  --clock clk \
  --reset rst_n \
  --clock-period-ns 10
```

The generator copies this tree, renames `__PREFIX__*` paths, replaces all
placeholders, and prints the remaining hand-editing checklist.

## Required hand edits after generation

1. `tb/<prefix>_if.sv` — replace the generic register-bus signals with the DUT
   interface signals (keep `clk`/`rst_n` and the driver/monitor contract or adapt it).
2. `tb/<prefix>_tb.sv` — connect the DUT instance to the interface and tie off
   unused ports.
3. `env/agent/<prefix>_driver.sv` / `_monitor.sv` — implement the real bus protocol.
4. `seq_lib/<prefix>_seq/<prefix>_smoke_seq.sv` — replace the example register
   write/read with the first real scenario.
5. `vcs_com/rtl.f` — point to the real RTL filelist.
6. `test_lib/smoke/smoke.tc` — set real `+UVM_TESTNAME`/`+SEQ`/plusargs.
7. If using a VIP, add the adapter under `env/vip/` and hook it into the base test.

> The template does **not** claim compile or simulation success until these
> adapters are filled in. Never report a UVM pass without a real compile log,
> simulator run log, and checks.

## Compile and run

```bash
cd <installed-template-directory>
make comp RTL_FILELIST=/abs/path/to/dut.f
make run UVM_TESTNAME=my_ip_smoke_test SEQ=my_ip_smoke_seq
# or
./scripts/run_case.sh smoke
```

See `docs/MIGRATION_FROM_I2C.md` for what was kept/removed from the source
environment and how to reintroduce a VIP cleanly.
