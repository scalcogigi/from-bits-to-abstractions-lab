import Blockly from '../../../blockly.js';

Blockly.Blocks["nop"] = {
  init: function () {
    this.appendDummyInput().appendField("nop");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(140);
    this.setTooltip("Instrução simples sem operandos (no operation).");
  },
};
