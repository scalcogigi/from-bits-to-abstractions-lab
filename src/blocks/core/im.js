import * as Blockly from 'blockly/core';
import { TYPES } from './types.js';

Blockly.Blocks['im'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("constante")
      .appendField(
        new Blockly.FieldNumber(0, -32768, 32767, 1), "VALUE");
    this.setOutput(true, [TYPES.IMM]);
    this.setColour(160);
    this.setTooltip("Imediatos válidos da arquitetura: $1, $0 e $-1");
  }
};

// ISA doesn't accept arbitrary immediates, addw/subw/movw no longer break
// and it removes the risk of writing something impossible
// immediates valids $1, $0, $-1
