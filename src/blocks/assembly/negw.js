import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["negw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck(TYPES.REG)
      .appendField("negw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("NEGW: aplica negação aritmética (valor → -valor).");
  },
};
