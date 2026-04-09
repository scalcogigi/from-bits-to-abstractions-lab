import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["nop"] = {
  init: function () {
    this.appendValueInput("OPERAND")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField("nop");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip("Pode opcionalmente acessar um registrador ou a memória (%A) sem alterar o estado.");
  }
};