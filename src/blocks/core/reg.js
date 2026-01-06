import * as Blockly from 'blockly/core';
import { TYPES } from './types.js';

Blockly.Blocks['reg_A'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("%A");
    this.setOutput(true, [
      TYPES.ALU_SRC_REG,
      TYPES.ALU_DEST
]);
    this.setColour(180);
    this.setTooltip("Registrador %A");
  }
};

Blockly.Blocks['reg_D'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("%D");
    this.setOutput(true, [
      TYPES.REG,
      TYPES.REG_NO_A,
      TYPES.ALU_SRC_REG,
      TYPES.ALU_DEST
    ]);
    this.setColour(180);
    this.setTooltip("Registrador %D.");
  }
};


// Prevents students from typing invalid registers and standardizes operators
// registers %A, %D

