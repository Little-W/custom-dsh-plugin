class __PREFIX___base_test extends uvm_test;
  `uvm_component_utils(__PREFIX___base_test)

  virtual __PREFIX___if vif;
  __PREFIX___env         m_env;

  function new(string name = "__PREFIX___base_test", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db#(virtual __PREFIX___if)::get(this, "", "vif", vif)) begin
      `uvm_fatal("NOVIF", "virtual __PREFIX___if is not set")
    end
    uvm_config_db#(virtual __PREFIX___if)::set(this, "m_env*", "vif", vif);
    m_env = __PREFIX___env::type_id::create("m_env", this);
  endfunction
endclass
