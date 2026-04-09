import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["orw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField("orw");

    this.appendValueInput("B")
      .setCheck(TYPES.REG)
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck(TYPES.REG)
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip(
      "ORW: operação lógica OR. Não aceita imediatos e não permite mem OR mem."
    );
  },
};
