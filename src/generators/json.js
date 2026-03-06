import * as Blockly from 'blockly/core';

const Order = { ATOMIC: 0 };

// auxiliares
function value(block, name) {
  if (!tuple) return null;
  if (Array.isArray(tuple)) return tuple[0];
  return tuple;
}

function flattenWorkspace(workspace) {
  const top = workspace.getTopBlocks(false);
  const all = [];

  function collect(block) {
    all.push(block);
    block.getChildren(false).forEach((child) => collect(child));
  }

  top.forEach((b) => collect(b));
  return all;
}

function instr(op, args) {
  return { op, args };
}

// terminais
jsonGenerator.forBlock["im"] = function(block) {
  return [block.getFieldValue("VALUE"), Order.ATOMIC];
};

jsonGenerator.forBlock["mem"] = function(block) {
  return ["(%A)", Order.ATOMIC];
};

jsonGenerator.forBlock["reg_A"] = function() {
  return ["%A", Order.ATOMIC];
};

jsonGenerator.forBlock["reg_D"] = function() {
  return ["%D", Order.ATOMIC];
};



// operações
jsonGenerator.forBlock["leaw"] = function (block) {
  const c = value(block, "CONST");
  return JSON.stringify(instr("leaw", [c, "%A"]));
};

jsonGenerator.forBlock["movw_reg"] =
jsonGenerator.forBlock["movw_mem"] =
  function (block) {
    const src = value(block, "SRC");
    const dest = value(block, "DEST");
    return JSON.stringify(instr("movw", [src, dest]));
  };


jsonGenerator.forBlock["addw"] = function (block) {
  return JSON.stringify(
    instr("addw", [
      value(block, "A"),
      value(block, "B"),
      value(block, "DEST"),
    ])
  );
};

jsonGenerator.forBlock["subw"] = function (block) {
  return JSON.stringify(
    instr("subw", [
      value(block, "A"),
      value(block, "B"),
      value(block, "DEST"),
    ])
  );
};

jsonGenerator.forBlock["rsubw"] = function (block) {
  return JSON.stringify(
    instr("rsubw", [
      value(block, "A"),
      value(block, "B"),
      value(block, "DEST"),
    ])
  );
};

jsonGenerator.forBlock["incw"] = function (block) {
  return JSON.stringify(instr("incw", [value(block, "REG")]));
};

jsonGenerator.forBlock["decw"] = function (block) {
  return JSON.stringify(instr("decw", [value(block, "REG")]));
};

jsonGenerator.forBlock["notw"] = function (block) {
  return JSON.stringify(instr("notw", [value(block, "REG")]));
};

jsonGenerator.forBlock["negw"] = function (block) {
  return JSON.stringify(instr("negw", [value(block, "REG")]));
};

jsonGenerator.forBlock["andw"] = function (block) {
  return JSON.stringify(
    instr("andw", [
      value(block, "A"),
      value(block, "B"),
      value(block, "DEST"),
    ])
  );
};

jsonGenerator.forBlock["orw"] = function (block) {
  return JSON.stringify(
    instr("orw", [
      value(block, "A"),
      value(block, "B"),
      value(block, "DEST"),
    ])
  );
};

jsonGenerator.forBlock["label"] = function (block) {
  const name = block.getFieldValue("NAME");
  return JSON.stringify(instr("label", [name]));
};

// jump
jsonGenerator.forBlock["jmp"] = function () {
  return JSON.stringify(instr("jmp", []));
};

jsonGenerator.forBlock["je"] = function (block) {
  return JSON.stringify(instr("je", [value(block, "REG")]));
};

jsonGenerator.forBlock["jne"] = function (block) {
  return JSON.stringify(instr("jne", [value(block, "REG")]));
};

jsonGenerator.forBlock["jg"] = function (block) {
  return JSON.stringify(instr("jg", [value(block, "REG")]));
};

jsonGenerator.forBlock["jge"] = function (block) {
  return JSON.stringify(instr("jge", [value(block, "REG")]));
};

jsonGenerator.forBlock["jl"] = function (block) {
  return JSON.stringify(instr("jl", [value(block, "REG")]));
};

jsonGenerator.forBlock["jle"] = function (block) {
  return JSON.stringify(instr("jle", [value(block, "REG")]));
};


// workspace
jsonGenerator.workspaceToCode = function (workspace) {
  const blocks = flattenWorkspace(workspace);

  const exec = blocks.filter(
    (b) =>
      typeof jsonGenerator.forBlock[b.type] === "function" &&
      !b.isInFlyout &&
      !b.isShadow() &&
      !["program", "start", "comment", "object", "member"].includes(b.type)
  );

  exec.sort((a, b) => a.y - b.y);

  const instructions = exec
  .map((b) => jsonGenerator.blockToCode(b))
  .filter((code) => typeof code === "string")
  .map((code) => JSON.parse(code));


  return JSON.stringify({ instructions }, null, 2);
};

export default jsonGenerator;

