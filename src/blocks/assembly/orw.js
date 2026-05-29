import Blockly from '../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["orw"] = {
  init: function () {
    this.appendValueInput("A")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField("orw");

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
      "ORW: operação lógica OR. Não aceita imediatos e não permite mem OR mem."
    );
  },
};
