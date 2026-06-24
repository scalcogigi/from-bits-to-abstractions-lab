import Blockly from '../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["movw"] = {
  init: function () {

    this.setInputsInline(true);
    
    this.appendValueInput("SRC1")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField("movw");

    this.appendValueInput("SRC2")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck(typeCheck([TYPES.REG_DEST, TYPES.MEM]))
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip(
      "movw aceita 2 ou 3 operandos. É necessário preencher pelo menos dois campos."
    );
  },
};
