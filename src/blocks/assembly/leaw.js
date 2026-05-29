import Blockly from '../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["leaw"] = {
  init: function () {
    this.setInputsInline(true);

    this.appendValueInput("CONST")
      .setCheck(typeCheck([TYPES.IMM, TYPES.LABEL_REF]))
      .appendField("leaw");

    this.appendDummyInput().appendField(", %A");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(230);

    this.setTooltip(
      "Carrega imediato ($0, $1, $-1), constante ($0–$65535) ou label em %A."
    );
  },
};
