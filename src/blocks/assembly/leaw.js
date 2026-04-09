import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["leaw"] = {
  init: function () {
    this.appendValueInput("CONST")
      .setCheck([TYPES.IMM, TYPES.LABEL_REF])
      .appendField("leaw");

    this.appendDummyInput().appendField(", %A");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);

    this.setTooltip("Carrega imediato em %A. Sempre escreve em %A.");
  },
};
