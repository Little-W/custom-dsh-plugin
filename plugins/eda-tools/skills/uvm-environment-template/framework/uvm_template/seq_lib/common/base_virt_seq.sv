// Common virtual-sequence base. All bus pin activity is owned by the driver;
// sequences submit transaction items through the virtual sequencer's bus handle.
class base_virt_seq extends uvm_sequence;
  `uvm_object_utils(base_virt_seq)
  `uvm_declare_p_sequencer(__PREFIX___virtual_sequencer)

  function new(string name = "base_virt_seq");
    super.new(name);
  endfunction

  task wait_reset_done();
    if (p_sequencer.vif == null) `uvm_fatal("NOVIF", "virtual sequencer requires vif")
    wait (p_sequencer.vif.__RESET__ === 1'b1);
    repeat (2) @(posedge p_sequencer.vif.__CLOCK__);
  endtask

  task bus_write(bit [15:0] addr, bit [31:0] data);
    __PREFIX___item req;
    req = __PREFIX___item::type_id::create("write_req");
    req.write = 1'b1;
    req.addr = addr;
    req.wdata = data;
    start_item(req, -1, p_sequencer.bus_sqr);
    finish_item(req);
    if (req.error) `uvm_error("BUS_WRITE", $sformatf("write error at 0x%04h", addr))
  endtask

  task bus_read(bit [15:0] addr, output bit [31:0] data);
    __PREFIX___item req;
    req = __PREFIX___item::type_id::create("read_req");
    req.write = 1'b0;
    req.addr = addr;
    req.wdata = '0;
    start_item(req, -1, p_sequencer.bus_sqr);
    finish_item(req);
    data = req.rdata;
    if (req.error) `uvm_error("BUS_READ", $sformatf("read error at 0x%04h", addr))
  endtask
endclass
