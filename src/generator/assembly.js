import Blockly from '../blockly.js';
import { reportError } from "../utils/error.js";

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


// validação de labels
function collectLabels(blocks) {
  const labels = new Set();
  for (const block of blocks) {
    if (block.type === "label") {
      const name = block.getFieldValue("NAME");
      if (labels.has(name)) return { error: `Label duplicada: ${name}` };
      labels.add(name);
    }
  }
  return { labels };
}

// instruções
assemblyGenerator.forBlock['leaw'] = function (block) {
  const c = value(block, 'CONST');
  
  if (!c) {
    return "";
  }
  
  return `leaw ${c}, %A`;
};

assemblyGenerator.forBlock['movw'] = assemblyGenerator.forBlock['movw'] = function(block) {
  const src = value(block, "SRC");
  const dest = value(block, "DEST");

  if (!src || !dest) {
    return "";
  }

  return `movw ${src}, ${dest}`;
};

assemblyGenerator.forBlock['addw'] = function(block) {
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

assemblyGenerator.forBlock['label'] = function(block) {
  const name = block.getFieldValue('NAME');

  // se estiver conectado como valor
  if (block.outputConnection && block.outputConnection.targetConnection) {
    return [name, Order.ATOMIC];
  }

  // se for definição
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
assemblyGenerator.forBlock["im"] = function(block) {
  const val = block.getFieldValue("VALUE");
  return [`$${val}`, Order.ATOMIC];
};

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

  const lines = executable.map(b => {
  const code = this.blockToCode(b);
  return typeof code === "string" ? code.trim() : "";
})
.filter(line => line.length > 0)

  if (lines.length === 0) {
    return "";
  }

  return lines.join("\n");

};

if (
  event.type !== Blockly.Events.BLOCK_CHANGE &&
  event.type !== Blockly.Events.BLOCK_CREATE &&
  event.type !== Blockly.Events.BLOCK_DELETE
) {
  return;
}

export default assemblyGenerator;