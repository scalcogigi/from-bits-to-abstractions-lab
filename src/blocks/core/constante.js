import Blockly from '../../blockly.js';
import { TYPES } from './types.js';
import { isModoLivre } from '../../mode.js';
import { typeCheck } from '../checks.js';

Blockly.Blocks['constante'] = {
  init: function () {
    const min = isModoLivre() ? -32768 : 0;
    const max = 65535;

    this.appendDummyInput()
      .appendField('constante $')
      .appendField(new Blockly.FieldNumber(0, min, max, 1), 'VALUE');

    this.setOutput(true, typeCheck([TYPES.IMM]));
    this.setOutputShape(2);
    this.setColour(210);
    this.setTooltip(
      isModoLivre()
        ? 'Constante livre.'
        : 'Constante não negativa: $0 a $65535.'
    );
  },
};