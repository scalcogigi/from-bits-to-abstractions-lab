import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["addw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck([TYPES.ALU_SRC_REG, TYPES.ALU_SRC_MEM])
      .appendField("addw");

    this.appendValueInput("B")
      .setCheck([TYPES.ALU_SRC_REG, TYPES.ALU_SRC_MEM])
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck([TYPES.ALU_DEST, TYPES.ALU_SRC_MEM])
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
  },
};
