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

  let closeTimeout = null;

  setTimeout(() => {
    const categoryElements = document.querySelectorAll('.blocklyToolboxCategory');
    const flyout = document.querySelector('.blocklyFlyout');
    if (!categoryElements.length || !flyout) return;

    const cancelClose = () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    };

    const scheduleClose = () => {
      cancelClose();
      closeTimeout = setTimeout(() => {
        toolbox.clearSelection();
      }, 250);
    };

    categoryElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        cancelClose();
        const items = toolbox.getToolboxItems();
        const category = items.find(item => item.id_ === element.id);
        if (category && toolbox.getSelectedItem() !== category) {
          toolbox.setSelectedItem(category);
        }
      });
      element.addEventListener('mouseleave', scheduleClose);
    });
    flyout.addEventListener('mouseenter', cancelClose);
    flyout.addEventListener('mouseleave', scheduleClose);
  }, 0); 
}

const errorManager = new ErrorManager(workspace);

const btnASM = document.getElementById('btnASM');
const btnCopy = document.getElementById('btnCopy');
const output = document.getElementById('output');

// Load saved workspace
load(workspace);


// -------------------- buttons ---------------------------
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

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent);
});

// auto-save
workspace.addChangeListener(() => {
  save(workspace);
});
