import Blockly from '../../blockly.js';
import { TYPES } from "../core/types.js";
import { typeCheck } from "../checks.js";

Blockly.Blocks["subw"] = {
  init: function () {

    this.setInputsInline(true);
    
    this.appendValueInput("A")
      .setCheck(typeCheck([TYPES.REG, TYPES.MEM]))
      .appendField("subw");

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
      "SUBW: calcula A - B e salva em DEST. Não permite mem - mem."
    );
  },
};
