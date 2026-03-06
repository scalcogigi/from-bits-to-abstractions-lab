import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["jl"] = {
  init: function () {
    this.appendDummyInput().appendField("jl");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("JNE: desvia para o endereço em %A se o registrador for menor que zero.");
  },
};


