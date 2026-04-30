import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["nop"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("nop");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("Pode opcionalmente acessar um registrador ou a memória (%A) sem alterar o estado.");
  }
};