import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/msg/pt-br';

import './style/main.css';
import './blocks/core/reg.js';
import './blocks/core/mem.js';
import './blocks/core/im.js';
import './blocks/core/constante.js';

import { toolbox } from './toolbox/toolbox.js';
import { load, save } from './serialization.js';

import './blocks/structure/program.js';
import './blocks/structure/start.js';
import './blocks/structure/comment.js';

import './blocks/assembly/movw.js';
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
import './blocks/assembly/nop.js';

import './blocks/control/label.js';
import './blocks/control/label_ref.js';
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

import assemblyGenerator from './generator/assembly.js';

console.time("startup");

console.log("assemblyGenerator:", assemblyGenerator);

// create workspace
const workspace = Blockly.inject(document.getElementById('blocklyDiv'), {
  toolbox: toolbox,
  renderer: 'geras',
  collapse: true,
  comments: true,
  zoom: { wheel: true, startScale: 1 }
});

enableToolboxHover(workspace); 

function enableToolboxHover(workspace) {
  const toolbox = workspace.getToolbox();
  if (!toolbox) return;

  setTimeout(() => {
    const categoryElements = document.querySelectorAll('.blocklyToolboxCategory');

    categoryElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        const items = toolbox.getToolboxItems();
        const category = items.find(item => item.id_ === element.id);
        if (category && toolbox.getSelectedItem() !== category) {
          toolbox.setSelectedItem(category);
        }
      });
    });
  }, 0); 
}


const errorManager = new ErrorManager(workspace);

const btnCopy = document.getElementById('btnCopy');
const output = document.getElementById('output');

function updateAssembly() {
  errorManager.clearAll();

  const ast = buildAST(workspace);
  const errors = validateProgram(ast);

  if (errors.length > 0) {
    errorManager.showErrors(errors);
    output.style.backgroundColor = "#4a1f1f";
    output.textContent = errors.map(e => e.message).join('\n');
    btnCopy.disabled = true;
    return;
  }

  try {
    const code = assemblyGenerator.workspaceToCode(workspace);

    if (!code || code.trim() === "") {
      output.style.backgroundColor = "#4a1f1f";
      output.textContent= "Preencha todos os campos obrigatórios.";
      btnCopy.disabled = true;
      return;
    }

    output.style.backgroundColor = "#0f172a";
    output.textContent = code;
    btnCopy.disabled = false;

  } catch (e) {
    output.style.borderColor = "#4a1f1f";
    output.textContent = 'Erro Assembly: ' + e.message;
    btnCopy.disabled = true;
    console.error(e);
  }
}

// Load saved workspace
// load(workspace);
updateAssembly();
console.timeEnd("startup");

setTimeout(() => {
  Blockly.Events.disable();

  load(workspace);

  Blockly.Events.enable();

  requestAnimationFrame(() => {
    updateAssembly();
  });
}, 0);


// -------------------- buttons ---------------------------

const btnNew = document.getElementById('btnNew');

btnNew.addEventListener('click', () => {
  if (confirm('Deseja iniciar um novo workspace? Todo o conteúdo atual será apagado.')) {
    workspace.clear(); 
    errorManager.clearAll();
    output.textContent = '';
    localStorage.removeItem('jsonGeneratorWorkspace'); 
  }
});

btnCopy.addEventListener('click', () => {
  const text = output.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    document.execCommand('copy');

    textarea.remove();
  }
});

let updateTimeout = null;

workspace.addChangeListener((event) => {
  if (event.type === Blockly.Events.UI) return;

  save(workspace);

  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateAssembly();
  }, 150);
});
