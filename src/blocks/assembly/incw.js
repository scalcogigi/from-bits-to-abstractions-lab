import Blockly from '../../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["incw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck(typeCheck([TYPES.REG_DEST]))
      .appendField("incw");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
  },
};
