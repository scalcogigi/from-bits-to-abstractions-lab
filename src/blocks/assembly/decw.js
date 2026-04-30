import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["decw"] = {
  init: function () {
    this.appendValueInput("REG")
      .setCheck([TYPES.REG_DEST])
      .appendField("decw");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip("DECW: decrementa o registrador em 1. Não aceita memória.");
  },
};
