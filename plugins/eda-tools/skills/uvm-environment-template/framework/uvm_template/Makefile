# Generic UVM template Makefile (VCS example).
# Override variables on the command line:
#   make comp RTL_FILELIST=/abs/dut.f
#   make run UVM_TESTNAME=my_ip_smoke_test SEQ=my_ip_smoke_seq
SHELL       := /bin/bash
VCS         ?= vcs
SIMV        ?= simv
RTL_FILELIST?= vcs_com/rtl.f
UVM_TESTNAME?=__PREFIX___smoke_test
SEQ         ?= __PREFIX___smoke_seq
PLUSARGS    ?=
LOG_DIR     ?= logs

.PHONY: comp run clean regress
comp:
	@mkdir -p $(LOG_DIR)
	$(VCS) -full64 -sverilog -timescale=1ns/1ps -ntb_opts uvm-1.2 \
	  -f $(RTL_FILELIST) -f vcs_com/vip.f -f vcs_com/verif.f \
	  -top __TB_TOP__ -l $(LOG_DIR)/comp.log

run:
	@mkdir -p $(LOG_DIR)
	./$(SIMV) +UVM_TESTNAME=$(UVM_TESTNAME) +SEQ=$(SEQ) $(PLUSARGS) \
	  -l $(LOG_DIR)/$(UVM_TESTNAME).log

regress:
	@set -e; for tc in test_lib/*/*.tc; do \
	  echo "== $$tc"; ./scripts/run_case.sh $$(basename $$(dirname $$tc)); \
	done

clean:
	rm -rf simv* csrc *.log $(LOG_DIR) ucli.key
