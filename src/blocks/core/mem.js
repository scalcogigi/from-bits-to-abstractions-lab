import * as Blockly from 'blockly/core';
import { TYPES } from './types.js';

Blockly.Blocks['mem'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("(%A)");
    this.setOutput(true, [TYPES.MEM]);
    this.setOutputShape(3);
    this.setColour(200);
    this.setTooltip("Acesso à memória no endereço %A.");
  }
};

// Memory can only be accessed via %A, eliminating errors that are impossible in hardware
// memorie %A

