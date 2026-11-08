# Template validation record

## Generator

```text
python3 scripts/instantiate.py \
  --dest <tmp>/demo_ip_tb --prefix demo_ip --dut-top demo_ip_top \
  --clock clk --reset rst_n --clock-period-ns 10
```

Result: 31 files generated, zero placeholder leftovers.

## Compile (VCS example)

A generated environment was compiled with:

```bash
vcs -full64 -sverilog -timescale=1ns/1ps -ntb_opts uvm-1.2 \
  -f vcs_com/vip.f -f vcs_com/verif.f -top demo_ip_tb -l comp.log
```

Result in this workspace:

```text
Top Level Modules: demo_ip_tb
TimeScale is 1 ns / 1 ps
10 modules and 0 UDP read.
CPU time: ... to compile + ... to elab + ... to link
exit=0
```

A throwaway stub DUT was used only to prove the generic TB/env/sequence
structure compiles. It is **not** a DUT verification result and is not included
in the template.

## Smoke simulation (stub only)

With a throwaway stub DUT that returns the example readback value, VCS compiled
and ran the generated test in one container command:

```bash
vcs -full64 -sverilog -timescale=1ns/1ps -ntb_opts uvm-1.2 \
  -f vcs_com/vip.f -f vcs_com/verif.f -top demo_ip_tb -R \
  +UVM_TESTNAME=demo_ip_smoke_test +SEQ=demo_ip_smoke_seq -l run.log
```

Observed summary: `UVM_ERROR=0`, `UVM_FATAL=0`, process exit `0`. This only
validates the template plumbing with an artificial stub; it is **not** real DUT
verification evidence. Simulation depends on the DUT's actual response model.
Do not report UVM PASS until the real DUT adapter, requirement-based checks and
coverage produce a run log.
