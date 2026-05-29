import Blockly from '../../blockly.js';
import { TYPES } from './types.js';
import { isModoLivre } from '../../mode.js';
import { typeCheck } from '../checks.js';

Blockly.Blocks['im'] = {
  init: function () {
    const row = this.appendDummyInput().appendField('imediato');

    if (isModoLivre()) {
      row
        .appendField('$')
        .appendField(new Blockly.FieldNumber(0, -32768, 65535, 1), 'VALUE');
    } else {
      row.appendField(
        new Blockly.FieldDropdown([
          ['$0', '0'],
          ['$1', '1'],
          ['$-1', '-1'],
        ]),
        'VALUE'
      );
    }

    this.setOutput(true, typeCheck([TYPES.IMM]));
    this.setOutputShape(2);
    this.setColour(200);
    this.setTooltip(
      isModoLivre()
        ? 'Imediato livre.'
        : 'Imediato da ISA: apenas $0, $1 e $-1.'
    );
  },
};
