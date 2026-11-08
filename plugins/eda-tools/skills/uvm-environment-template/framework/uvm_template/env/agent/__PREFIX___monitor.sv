// Generic monitor: samples accepted valid/ready transfers.
class __PREFIX___monitor extends uvm_component;
  `uvm_component_utils(__PREFIX___monitor)
  virtual __PREFIX___if vif;
  uvm_analysis_port#(__PREFIX___item) ap;

  function new(string name = "__PREFIX___monitor", uvm_component parent = null);
    super.new(name, parent);
    ap = new("ap", this);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db#(virtual __PREFIX___if)::get(this, "", "vif", vif)) begin
      `uvm_fatal("NOVIF", "__PREFIX___if is not set for monitor")
    end
  endfunction

  task run_phase(uvm_phase phase);
    __PREFIX___item tr;
    forever begin
      @(posedge vif.__CLOCK__);
      if (vif.__RESET__ === 1'b1 && vif.bus_valid === 1'b1 && vif.bus_ready === 1'b1) begin
        tr = __PREFIX___item::type_id::create("tr");
        tr.write = vif.bus_write;
        tr.addr  = vif.bus_addr;
        tr.wdata = vif.bus_wdata;
        tr.rdata = vif.bus_rdata;
        tr.error = vif.bus_error;
        ap.write(tr);
      end
    end
  endtask
endclass
