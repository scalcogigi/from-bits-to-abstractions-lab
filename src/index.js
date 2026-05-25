import './mode.js';

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
const assemblyPanel = document.getElementById('assemblyPanel');

function setAssemblyPanelState({ valid, message = '' }) {
  if (valid) {
    assemblyPanel.classList.remove('assembly-panel--error');
    btnCopy.disabled = false;
    return;
  }

  assemblyPanel.classList.add('assembly-panel--error');
  btnCopy.disabled = true;
  output.textContent = message;
}

function updateAssembly() {
  errorManager.clearAll();

  const ast = buildAST(workspace);
  const errors = validateProgram(ast, workspace);

  if (errors.length > 0) {
    errorManager.showErrors(errors);
    setAssemblyPanelState({ valid: false, message: '' });
    return;
  }

  setAssemblyPanelState({ valid: true });

  try {
    const code = assemblyGenerator.workspaceToCode(workspace);
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      output.textContent = '';
      return;
    }

    output.textContent = code;
  } catch (e) {
    setAssemblyPanelState({ valid: false, message: '' });
    output.textContent = 'Erro Assembly: ' + e.message;
    console.error(e);
  }
}

load(workspace);
updateAssembly();

const btnNew = document.getElementById('btnNew');

btnNew.addEventListener('click', () => {
  if (confirm('Deseja iniciar um novo workspace? Todo o conteúdo atual será apagado.')) {
    workspace.clear();
    errorManager.clearAll();
    output.textContent = '';
    setAssemblyPanelState({ valid: true });
    localStorage.removeItem('jsonGeneratorWorkspace');
  }
});

btnCopy.addEventListener('click', () => {
  if (btnCopy.disabled) return;
  navigator.clipboard.writeText(output.textContent);
});

let updateTimeout = null;

workspace.addChangeListener((event) => {
  if (event.type === Blockly.Events.UI) return;
  if (event.type === Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE) return;

  save(workspace);

  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateAssembly();
  }, 150);
});
