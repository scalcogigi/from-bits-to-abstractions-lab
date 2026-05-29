import Blockly from '../../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["notw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck(typeCheck([TYPES.REG_DEST]))
      .appendField("notw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("NOTW: inverte todos os bits do registrador.");
  },
};
