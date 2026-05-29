import Blockly from '../../blockly.js';

Blockly.Blocks['start'] = {
  init: function() {
    this.appendDummyInput().appendField("Início");
    this.appendStatementInput("BODY")
      .setCheck(null)
      .appendField("Código");

    this.setPreviousStatement(false);
    this.setNextStatement(true);
    this.setColour(20);
    this.setTooltip("Ponto inicial do programa.");
  }
};