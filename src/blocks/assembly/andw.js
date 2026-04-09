import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";

Blockly.Blocks["andw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck([TYPES.REG, TYPES.MEM])
      .appendField("andw");

    this.appendValueInput("B")
      .setCheck([TYPES.REG])
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck([TYPES.REG])
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip(
      "ANDW: operação lógica AND entre A e B. Não aceita imediatos e não permite mem AND mem."
    );
  },
};
