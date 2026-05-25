import * as Blockly from "blockly/core";
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["andw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField("andw");

    this.appendValueInput("B")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField(",");

    this.appendValueInput("DEST")
      .setCheck(typeCheck([TYPES.REG_DEST, TYPES.MEM]))
      .appendField(",");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip(
      "ANDW: operação lógica AND entre A e B. Não aceita imediatos e não permite mem AND mem."
    );
  },
};
