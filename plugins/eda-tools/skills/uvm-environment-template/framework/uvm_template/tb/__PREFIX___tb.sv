module __TB_TOP__;
  import uvm_pkg::*;
  `include "uvm_macros.svh"
  import __PREFIX___test_pkg::*;

  logic __CLOCK__;
  logic __RESET__;

  __PREFIX___if u_if(__CLOCK__);
  assign u_if.__RESET__ = __RESET__;

  // TODO: replace this placeholder with the real DUT instance and port map.
  // The template intentionally does not assume a DUT port list.
  __DUT_TOP__ u_dut (
    .__CLOCK__ (__CLOCK__),
    .__RESET__ (__RESET__)
    // , .bus_valid (u_if.bus_valid) ...
  );

  initial begin
    __CLOCK__ = 1'b0;
    forever #(__CLOCK_PERIOD_NS__/2.0) __CLOCK__ = ~__CLOCK__;
  end

  initial begin
    __RESET__ = 1'b0;
    repeat (5) @(posedge __CLOCK__);
    __RESET__ = 1'b1;
  end

  initial begin
    uvm_config_db#(virtual __PREFIX___if)::set(null, "uvm_test_top", "vif", u_if);
    run_test();
  end
endmodule
