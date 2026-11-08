// Example smoke sequence: replace addresses/data/checks with the real DUT scenario.
class __PREFIX___smoke_seq extends base_virt_seq;
  `uvm_object_utils(__PREFIX___smoke_seq)

  function new(string name = "__PREFIX___smoke_seq");
    super.new(name);
  endfunction

  task body();
    bit [31:0] rdata;
    wait_reset_done();
    bus_write(16'h0000, 32'h0000_0001);
    bus_read(16'h0000, rdata);
    if (rdata !== 32'h0000_0001) begin
      `uvm_error("SMOKE_MISMATCH", $sformatf("readback 0x%08h != 0x00000001", rdata))
    end
  endtask
endclass
