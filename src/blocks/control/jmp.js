import * as Blockly from "blockly/core";

Blockly.Blocks["jmp"] = {
  init: function () {
    this.appendDummyInput().appendField("jmp");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  },
};
