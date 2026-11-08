class __PREFIX___agent extends uvm_agent;
  `uvm_component_utils(__PREFIX___agent)
  __PREFIX___sequencer sqr;
  __PREFIX___driver    drv;
  __PREFIX___monitor   mon;

  function new(string name = "__PREFIX___agent", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    mon = __PREFIX___monitor::type_id::create("mon", this);
    if (is_active == UVM_ACTIVE) begin
      sqr = __PREFIX___sequencer::type_id::create("sqr", this);
      drv = __PREFIX___driver::type_id::create("drv", this);
    end
  endfunction

  function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    if (is_active == UVM_ACTIVE) begin
      drv.seq_item_port.connect(sqr.seq_item_export);
    end
  endfunction
endclass
