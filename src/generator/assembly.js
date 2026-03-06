import * as Blockly from 'blockly/core';
import { reportError } from "../utils/error.js";

const assemblyGenerator = new Blockly.Generator('Assembly');

const Order = { ATOMIC: 0 };

// Auxiliares
function value(block, name) {
  return assemblyGenerator.valueToCode(block, name, Order.ATOMIC) || null;
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
  return `leaw ${c}, %A`;
};

assemblyGenerator.forBlock['movw_reg'] = assemblyGenerator.forBlock['movw_mem'] = function(block) {
  return `movw ${value(block,"SRC")}, ${value(block,"DEST")}`;
};

assemblyGenerator.forBlock['addw'] = function(block) {
  return `addw ${value(block,"A")}, ${value(block,"B")}, ${value(block,"DEST")}`;
};

assemblyGenerator.forBlock["subw"] = function (block) {
  return `subw ${value(block,"A")}, ${value(block,"B")}, ${value(block,"DEST")}`;

};

assemblyGenerator.forBlock["rsubw"] = function (block) {
  return `rsubw ${value(block,"A")}, ${value(block,"B")}, ${value(block,"DEST")}`;

};

assemblyGenerator.forBlock['incw'] = function(block) {
  const reg = value(block, 'REG');
  return `incw ${reg}`;
};

assemblyGenerator.forBlock["decw"] = function (block) {
  const r = value(block, "REG");
  return `decw ${r}`;
};

assemblyGenerator.forBlock["notw"] = function (block) {
  const r = value(block, "REG");
  return `notw ${r}`;
};

assemblyGenerator.forBlock["negw"] = function (block) {
  const r = value(block, "REG");
  return `negw ${r}`;
};

assemblyGenerator.forBlock["andw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  return `andw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock["orw"] = function (block) {
  const a = value(block, "A");
  const b = value(block, "B");
  const dest = value(block, "DEST");

  return `orw ${a}, ${b}, ${dest}`;
};

assemblyGenerator.forBlock['label'] = function(block) {
  const name = block.getFieldValue('NAME');
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
  return [val, Order.ATOMIC];
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

  return executable
  .map(b => {
  const code = this.blockToCode(b);
  return typeof code === "string" ? code.trim() : "";
})
.filter(line => line.length > 0)
.join("\n") + "\n";

};


export default assemblyGenerator;