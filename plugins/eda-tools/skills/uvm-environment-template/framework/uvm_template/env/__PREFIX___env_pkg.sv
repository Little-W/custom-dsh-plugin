package __PREFIX___env_pkg;
  import uvm_pkg::*;
  `include "uvm_macros.svh"
  import __PREFIX___agent_pkg::*;

  `include "__PREFIX___vir_sqr.sv"

  class __PREFIX___env extends uvm_env;
    `uvm_component_utils(__PREFIX___env)

    __PREFIX___agent              agt;
    __PREFIX___virtual_sequencer  virt_sqr;

    function new(string name = "__PREFIX___env", uvm_component parent = null);
      super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
      super.build_phase(phase);
      agt = __PREFIX___agent::type_id::create("agt", this);
      virt_sqr = __PREFIX___virtual_sequencer::type_id::create("virt_sqr", this);
    endfunction

    function void connect_phase(uvm_phase phase);
      super.connect_phase(phase);
      virt_sqr.bus_sqr = agt.sqr;
    endfunction
  endclass
endpackage
