import Blockly from '../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["decw"] = {
  init: function () {

    this.setInputsInline(true);
    
    this.appendValueInput("REG")
      .setCheck(typeCheck([TYPES.REG_DEST]))
      .appendField("decw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("DECW: decrementa o registrador em 1. Não aceita memória.");
  },
};
