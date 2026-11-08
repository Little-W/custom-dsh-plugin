// Generic DUT interface. Replace the generic register-bus fields with the
// real DUT interface (or keep this contract and adapt the driver/monitor).
interface __PREFIX___if(input logic __CLOCK__);
  logic __RESET__;

  // Minimal valid/ready register bus (generic placeholder)
  logic        bus_valid;
  logic        bus_write;
  logic [15:0] bus_addr;
  logic [31:0] bus_wdata;
  logic [31:0] bus_rdata;
  logic        bus_ready;
  logic        bus_error;

  // TODO: add DUT-specific clock/reset domains and pins here.

  clocking drv_cb @(posedge __CLOCK__);
    default input #1step output #0;
    output bus_valid, bus_write, bus_addr, bus_wdata;
    input  bus_ready, bus_rdata, bus_error;
  endclocking

  clocking mon_cb @(posedge __CLOCK__);
    input bus_valid, bus_write, bus_addr, bus_wdata, bus_ready, bus_rdata, bus_error;
  endclocking
endinterface
