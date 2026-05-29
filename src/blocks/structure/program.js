import Blockly from '../../blockly.js';

Blockly.Blocks['program'] = {
  init: function() {
    this.appendDummyInput().appendField("Programa");
    this.appendStatementInput("BODY")
      .setCheck(null)
      .appendField("Instruções");

    this.setColour(10);
    this.setTooltip("Raiz do programa.");
  }
};
