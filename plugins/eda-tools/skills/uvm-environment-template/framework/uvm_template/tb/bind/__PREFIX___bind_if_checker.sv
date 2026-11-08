// Optional SVA checker template. Adapt signal names and enable it from
// tb/<prefix>_tb.sv or a separate bind file when the DUT interface is known.
module __PREFIX___bind_if_checker(
  input logic __CLOCK__,
  input logic __RESET__,
  input logic bus_valid,
  input logic bus_ready
);
  property p_valid_ready_no_hang;
    @(posedge __CLOCK__) disable iff (!__RESET__)
      (bus_valid && !bus_ready) |-> ##[1:64] bus_ready;
  endproperty
  assert property (p_valid_ready_no_hang)
    else $error("generic UVM template: valid held without ready within 64 cycles");
endmodule
