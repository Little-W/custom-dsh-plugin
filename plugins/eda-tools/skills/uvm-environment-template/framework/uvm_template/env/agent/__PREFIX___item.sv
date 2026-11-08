class __PREFIX___item extends uvm_sequence_item;
  `uvm_object_utils(__PREFIX___item)

  rand bit        write;
  rand bit [15:0] addr;
  rand bit [31:0] wdata;
  bit [31:0] rdata;
  bit        error;

  function new(string name = "__PREFIX___item");
    super.new(name);
  endfunction
endclass
