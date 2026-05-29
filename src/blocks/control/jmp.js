import Blockly from '../../../blockly.js';

Blockly.Blocks["jmp"] = {
  init: function () {
    this.appendDummyInput().appendField("jmp");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  },
};
