import Blockly from '../../blockly.js';

Blockly.Blocks["label"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("label")
      .appendField(new Blockly.FieldTextInput("LOOP"), "NAME");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("Define um rótulo no fluxo do programa (ex.: LOOP:).");
  },
};
