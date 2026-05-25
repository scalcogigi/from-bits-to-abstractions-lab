import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["movw"] = {
  init: function () {
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
      "Move dados entre registrador e memória. Preencha pelo menos dois dos três campos."
    );
  },
};
