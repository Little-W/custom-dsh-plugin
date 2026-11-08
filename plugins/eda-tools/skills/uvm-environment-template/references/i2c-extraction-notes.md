# Extraction notes: i2c_tb -> generic template

Source: `/media/6/IC/verif/i2c_tb`
Detailed mapping: `<repo>/examples/uvm_template/docs/MIGRATION_FROM_I2C.md`

Kept:
- one TB top with clock/reset and `run_test()`;
- config_db virtual-interface handoff;
- test -> sequence selection via `+SEQ`;
- base virtual sequence with reset wait and bus helpers;
- UVM agent/env/virtual-sequencer skeleton;
- `.tc` case files and VCS filelist structure;
- optional bind/SVA checker pattern.

Removed:
- I2C DUT, open-drain bridge, I2C/APB/AXI/AHB SVT VIPs;
- i2c register model and all i2c sequences/tests/plusargs;
- vendor absolute include paths, license setup, bms/fe_bms scripts, reports.

Reintroducing VIP:
- keep vendor packages/includes in `vcs_com/vip.f`;
- add an adapter package under `env/vip/`;
- expose VIP sequencer handles through the virtual sequencer/base test;
- keep the generic environment compilable with VIP disabled.
