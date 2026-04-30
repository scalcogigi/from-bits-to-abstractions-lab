import * as Blockly from "blockly/core";
import { TYPES } from "../core/types";

Blockly.Blocks["label"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("label")
      .appendField(new Blockly.FieldTextInput("LOOP"), "NAME")

    this.setOutput(true, [TYPES.LABEL_REF]);
    this.setOutputShape(2);
      
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("Define um rótulo.");
  },
};