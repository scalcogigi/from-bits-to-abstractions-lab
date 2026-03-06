import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["je"] = {
  init: function () {
    this.appendDummyInput().appendField("je");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  },
};