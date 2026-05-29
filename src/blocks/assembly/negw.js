import Blockly from '../../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["negw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck(typeCheck([TYPES.REG_DEST]))
      .appendField("negw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("NEGW: aplica negação aritmética (valor → -valor).");
  },
};
