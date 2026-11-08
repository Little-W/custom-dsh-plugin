class __PREFIX___smoke_test extends __PREFIX___base_test;
  `uvm_component_utils(__PREFIX___smoke_test)

  function new(string name = "__PREFIX___smoke_test", uvm_component parent = null);
    super.new(name, parent);
  endfunction

  task run_phase(uvm_phase phase);
    string seq_name;
    uvm_object seq_obj;
    uvm_sequence_base seq_base;
    base_virt_seq virt_seq;
    phase.raise_objection(this);

    if (!$value$plusargs("SEQ=%s", seq_name)) begin
      seq_name = "__PREFIX___smoke_seq";
    end

    seq_obj = uvm_factory::get().create_object_by_name(seq_name, get_full_name(), "seq_obj");
    if (seq_obj == null) `uvm_fatal("BAD_SEQ", $sformatf("Unknown +SEQ=%s", seq_name))
    if (!$cast(seq_base, seq_obj)) `uvm_fatal("BAD_SEQ_TYPE", $sformatf("SEQ=%s is not a uvm_sequence", seq_name))

    if ($cast(virt_seq, seq_base)) begin
      seq_base.start(m_env.virt_sqr);
    end else begin
      seq_base.start(m_env.agt.sqr);
    end

    repeat (20) @(posedge vif.__CLOCK__);
    `uvm_info(get_type_name(), $sformatf("completed with +SEQ=%s", seq_name), UVM_LOW)
    phase.drop_objection(this);
  endtask
endclass
