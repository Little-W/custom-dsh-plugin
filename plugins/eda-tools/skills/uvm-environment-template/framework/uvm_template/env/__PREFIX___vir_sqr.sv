class __PREFIX___virtual_sequencer extends uvm_sequencer;
  `uvm_component_utils(__PREFIX___virtual_sequencer)

  virtual __PREFIX___if vif;
  __PREFIX___sequencer   bus_sqr;

  function new(string name = "__PREFIX___virtual_sequencer", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db#(virtual __PREFIX___if)::get(this, "", "vif", vif)) begin
      `uvm_fatal("NOVIF", "__PREFIX___if is not set for virtual sequencer")
    end
  endfunction
endclass
