// UVM env/agent/sequences/test + TB top (relative to the generated TB root)
+incdir+env/agent
env/agent/__PREFIX___agent_pkg.sv
+incdir+env
env/__PREFIX___env_pkg.sv

+incdir+seq_lib/common
seq_lib/common/common_seq_pkg.sv
+incdir+seq_lib/__PREFIX___seq
seq_lib/__PREFIX___seq/__PREFIX___seq_pkg.sv
+incdir+seq_lib
seq_lib/__PREFIX___test_pkg.sv

+incdir+tb
tb/__PREFIX___if.sv
tb/__PREFIX___tb.sv
