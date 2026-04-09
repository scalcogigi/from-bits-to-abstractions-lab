import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["movw"] = {
  init: function () {
    this.appendValueInput("SRC")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField("movw");

    this.appendValueInput("DEST")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip("Move dados entre registrador e memória.");
  },
};