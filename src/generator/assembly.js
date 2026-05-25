import * as Blockly from 'blockly/core';
import { reportError } from "../utils/error.js";
import { immediateFromField } from "../utils/immediate.js";

const assemblyGenerator = new Blockly.Generator('Assembly');

const Order = { ATOMIC: 0 };

// Auxiliares
function value(block, name) {
  const v = assemblyGenerator.valueToCode(block, name, Order.ATOMIC);
  return v ? v : "";
}

// coletar blocos
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


// Referências de label (ex.: leaw LOOP) podem repetir o mesmo nome sem erro.
function collectLabels() {
  return {};
}

// instruções
assemblyGenerator.forBlock['leaw'] = function (block) {
  const c = value(block, 'CONST');
  
  if (!c) {
    return "";
  }
  
  return `leaw ${c}, %A`;
};

function movwOperands(block) {
  return {
    src1: value(block, "SRC1"),
    src2: value(block, "SRC2"),
    dest: value(block, "DEST"),
  };
}

assemblyGenerator.forBlock["movw"] = function (block) {
  const { src1, src2, dest } = movwOperands(block);
  const filled = [src1, src2, dest].filter(Boolean);

  if (filled.length < 2) {
    return "";
  }

  if (src1 && src2 && dest) {
    return `movw ${src1}, ${src2}, ${dest}`;
  }
  if (src1 && dest) {
    return `movw ${src1}, ${dest}`;
  }
  if (src1 && src2) {
    return `movw ${src1}, ${src2}`;
  }
  if (src2 && dest) {
    return `movw ${src2}, ${dest}`;
  }

  return "";
};

assemblyGenerator.forBlock["addw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  if (!a || !b || !dest) {
    return "";
  }

  return `addw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock["subw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  if (!a || !b || !dest) {
    return "";
  }

  return `subw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock["rsubw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  if (!a || !b || !dest) {
    return "";
  }

  return `rsubw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock['incw'] = function(block) {
  const reg = value(block, 'REG');
  
  if (!reg) {
    return "";
  }
  
  return `incw ${reg}`;
};

assemblyGenerator.forBlock["decw"] = function (block) {
  const r = value(block, "REG");
  
  if (!r) {
    return "";
  }
  
  return `decw ${r}`;
};

assemblyGenerator.forBlock["notw"] = function (block) {
  const r = value(block, "REG");
  
  if (!r) {
    return "";
  }
  
  return `notw ${r}`;
};

assemblyGenerator.forBlock["nop"] = function() {
  return "nop";
};

assemblyGenerator.forBlock["negw"] = function (block) {
  const r = value(block, "REG");
  
  if (!r) {
    return "";
  }
  
  return `negw ${r}`;
};

assemblyGenerator.forBlock["andw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  if (!a || !b || !dest) {
    return "";
  }

  return `andw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock["orw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  if (!a || !b || !dest) {
    return "";
  }

  return `orw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock["label_ref"] = function (block) {
  return [block.getFieldValue("NAME"), Order.ATOMIC];
};

// Definição no fluxo; workspaces antigos podem ainda usar label como operando
assemblyGenerator.forBlock["label"] = function (block) {
  const name = block.getFieldValue("NAME");
  if (block.outputConnection?.targetConnection) {
    return [name, Order.ATOMIC];
  }
  return `${name}:`;
};

assemblyGenerator.forBlock["comment"] = function(block) {
  const text = block.getFieldValue("TEXT");
  return `# ${text}`;
};
// jump labels
assemblyGenerator.forBlock["jmp"] = () => `jmp`;
assemblyGenerator.forBlock["je"] = (block) => `je`;
assemblyGenerator.forBlock["jne"] = (block) => `jne`;
assemblyGenerator.forBlock["jg"] = (block) => `jg`;
assemblyGenerator.forBlock["jge"] = (block) => `jge`;
assemblyGenerator.forBlock["jl"] = (block) => `jl`;
assemblyGenerator.forBlock["jle"] = (block) => `jle`;

// terminais
function immediateCode(block) {
  const imm = immediateFromField(block.getFieldValue("VALUE"));
  return imm ? [imm, Order.ATOMIC] : ["", Order.ATOMIC];
}

assemblyGenerator.forBlock["im"] = immediateCode;
assemblyGenerator.forBlock["constante"] = immediateCode;

assemblyGenerator.forBlock["mem"] = function(block) {
  return ["(%A)", Order.ATOMIC];
};

assemblyGenerator.forBlock["reg_A"] = function() {
  return ["%A", Order.ATOMIC];
};

assemblyGenerator.forBlock["reg_D"] = function() {
  return ["%D", Order.ATOMIC];
};


// workspace
assemblyGenerator.workspaceToCode = function (workspace) {
  assemblyGenerator.outputPanel = document.getElementById("output");

  const blocks = flattenWorkspace(workspace);

  const labelInfo = collectLabels(blocks);
  if (labelInfo.error) {
    reportError(blocks[0], labelInfo.error, this.outputPanel);
    return "";
  }

  const executable = blocks.filter(b =>
    typeof assemblyGenerator.forBlock[b.type] === "function" &&
    !b.isInFlyout &&
    !b.isShadow() &&
    b.type !== "program" &&
    b.type !== "start" &&
    b.type !== "object" &&
    b.type !== "member"
  );

  executable.sort((a, b) => a.y - b.y);

  return executable
  .map(b => {
  const code = this.blockToCode(b);
  return typeof code === "string" ? code.trim() : "";
})
.filter(line => line.length > 0)
.join("\n") + "\n";


};


export default assemblyGenerator;