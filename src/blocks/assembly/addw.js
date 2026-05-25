import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["addw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField("addw");

    this.appendValueInput("B")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck(typeCheck([TYPES.REG_DEST, TYPES.MEM]))
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
  },
};
