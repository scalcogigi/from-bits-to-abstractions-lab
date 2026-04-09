import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["notw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck(TYPES.REG)
      .appendField("notw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("NOTW: inverte todos os bits do registrador.");
  },
};
