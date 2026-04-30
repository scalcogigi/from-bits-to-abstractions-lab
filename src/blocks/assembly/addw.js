import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["addw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField("addw");

    this.appendValueInput("B")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck([TYPES.REG_DEST, TYPES.MEM])
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
  },
};
