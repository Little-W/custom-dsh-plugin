// Generic valid/ready driver. Replace the bus handshake with the real protocol.
class __PREFIX___driver extends uvm_driver#(__PREFIX___item);
  `uvm_component_utils(__PREFIX___driver)
  virtual __PREFIX___if vif;

  function new(string name = "__PREFIX___driver", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db#(virtual __PREFIX___if)::get(this, "", "vif", vif)) begin
      `uvm_fatal("NOVIF", "__PREFIX___if is not set for driver")
    end
  endfunction

  task run_phase(uvm_phase phase);
    __PREFIX___item req;
    int unsigned timeout_cycles;
    forever begin
      seq_item_port.get_next_item(req);
      timeout_cycles = 0;
      vif.bus_valid <= 1'b1;
      vif.bus_write <= req.write;
      vif.bus_addr  <= req.addr;
      vif.bus_wdata <= req.wdata;
      while (vif.bus_ready !== 1'b1) begin
        @(posedge vif.__CLOCK__);
        timeout_cycles++;
        if (timeout_cycles > 10000) begin
          `uvm_fatal("BUS_TIMEOUT", "bus_ready did not assert within 10000 cycles")
        end
      end
      req.rdata = vif.bus_rdata;
      req.error = vif.bus_error;
      @(posedge vif.__CLOCK__);
      vif.bus_valid <= 1'b0;
      // Return response on the same transaction handle so the sequence can
      // inspect rdata/error after finish_item().
      seq_item_port.item_done(req);
    end
  endtask
endclass
