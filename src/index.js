import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/msg/pt-br';

import './style/main.css';
import './blocks/core/reg.js';
import './blocks/core/mem.js';
import './blocks/core/im.js';

import { toolbox } from './toolbox/toolbox.js';
import { load, save } from './serialization.js';

import './blocks/structure/program.js';
import './blocks/structure/start.js';
import './blocks/structure/comment.js';

import './blocks/assembly/movw_reg.js';
import './blocks/assembly/movw_mem.js';
import './blocks/assembly/leaw.js';
import './blocks/assembly/addw.js';
import './blocks/assembly/subw.js';
import './blocks/assembly/rsubw.js';
import './blocks/assembly/incw.js';
import './blocks/assembly/decw.js';
import './blocks/assembly/notw.js';
import './blocks/assembly/negw.js';
import './blocks/assembly/andw.js';
import './blocks/assembly/orw.js';

import './blocks/control/label.js';
import './blocks/control/jmp.js';
import './blocks/control/je.js';
import './blocks/control/jne.js';
import './blocks/control/jg.js';
import './blocks/control/jge.js';
import './blocks/control/jl.js';
import './blocks/control/jle.js';

import { buildAST } from './ast/builder.js';
import { validateProgram } from './validation/index.js';
import { ErrorManager } from './ui/ErrorManager.js';

import assemblyGenerator from './generators/assembly.js';
import jsonGenerator from './generators/json.js';

console.log("jsonGenerator:", jsonGenerator);
console.log("assemblyGenerator:", assemblyGenerator);

// create workspace
const workspace = Blockly.inject(document.getElementById('blocklyDiv'), {
  toolbox: toolbox,
  renderer: 'geras',
  collapse: true,
  comments: true,
  zoom: { wheel: true, startScale: 1 }
});

const errorManager = new ErrorManager(workspace);

// Load saved workspace
load(workspace);
// workspace.addChangeListener(() => {
//   errorManager.clearAll();
//   const ast = buildAST(workspace);
//   const errors = validateProgram(ast);
//   errorManager.showErrors(errors);
// });

// a run button and code output panel
const controls = document.createElement('div');
controls.style.position = 'absolute';
controls.style.right = '8px';
controls.style.top = '8px';
controls.style.zIndex = '999';
controls.style.background = 'rgba(255,255,255,0.9)';
controls.style.padding = '10px';
controls.style.borderRadius = '8px';
controls.style.display = 'flex';
controls.style.flexDirection = 'column';
controls.style.gap = '8px';

// button - generate json
const runBtn = document.createElement('button');
runBtn.textContent = 'Gerar JSON';
controls.appendChild(runBtn);

// assembly - generate assembly
const btnASM = document.createElement('button');
btnASM.textContent = 'Gerar Assembly';
controls.appendChild(btnASM);

// output
const output = document.createElement('pre');
output.id = 'output';
output.style.whiteSpace = 'pre-wrap';
output.style.fontFamily = 'monospace';
output.style.fontSize = '13px';
output.style.height = '60vh';
output.style.overflow = 'auto';
output.style.marginTop = '8px';
output.style.padding = '8px';
output.style.border = '1px solid #ddd';
controls.appendChild(output);

document.body.appendChild(controls);

// -------------------- buttons ---------------------------
runBtn.addEventListener('click', () => {
  errorManager.clearAll();

  const ast = buildAST(workspace);
  const errors = validateProgram(ast);

  if (errors.length > 0) {
    errorManager.showErrors(errors);
    output.textContent = errors.map(e => e.message).join('\n');
    return;
  }

  try {
    const code = jsonGenerator.workspaceToCode(workspace);
    output.textContent = code;
  } catch (e) {
    output.textContent = 'Erro JSON: ' + e.message;
    console.error(e);
  }
});

btnASM.addEventListener('click', () => {
  errorManager.clearAll();

  const ast = buildAST(workspace);
  const errors = validateProgram(ast);

  if (errors.length > 0) {
    errorManager.showErrors(errors);
    output.textContent = errors.map(e => e.message).join('\n');
    return;
  }

  try {
    const code = assemblyGenerator.workspaceToCode(workspace);
    output.textContent = code;
  } catch (e) {
    output.textContent = 'Erro Assembly: ' + e.message;
    console.error(e);
  }
});

// auto-save
workspace.addChangeListener(() => {
  save(workspace);
});
