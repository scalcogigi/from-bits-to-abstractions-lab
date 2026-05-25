import { ValidationCategories } from './types.js';

const THREE_OPERAND_BLOCKS = [
  'addw',
  'subw',
  'rsubw',
  'andw',
  'orw',
];

const SINGLE_OPERAND_BLOCKS = [
  'incw',
  'decw',
  'notw',
  'negw',
];

function isValueConnected(block, inputName) {
  const input = block.getInput(inputName);
  const target = input?.connection?.targetBlock();
  if (!target || target.isShadow()) return false;
  return true;
}

function isBlockInProgramChain(block) {
  return (
    block.previousConnection?.isConnected() ||
    block.nextConnection?.isConnected()
  );
}

function movwFilledCount(block) {
  return ['SRC1', 'SRC2', 'DEST'].filter((name) =>
    isValueConnected(block, name)
  ).length;
}

function checkBlockCompleteness(block) {
  const errors = [];
  const message =
    'Preencha todos os campos obrigatórios desta instrução.';

  switch (block.type) {
    case 'movw':
      if (movwFilledCount(block) < 2) {
        errors.push({
          blockId: block.id,
          category: ValidationCategories.ESTRUTURAL,
          message,
        });
      }
      break;

    case 'leaw':
      if (!isValueConnected(block, 'CONST')) {
        errors.push({
          blockId: block.id,
          category: ValidationCategories.ESTRUTURAL,
          message,
        });
      }
      break;

    case 'addw':
    case 'subw':
    case 'rsubw':
    case 'andw':
    case 'orw':
      if (
        !isValueConnected(block, 'A') ||
        !isValueConnected(block, 'B') ||
        !isValueConnected(block, 'DEST')
      ) {
        errors.push({
          blockId: block.id,
          category: ValidationCategories.ESTRUTURAL,
          message,
        });
      }
      break;

    case 'incw':
    case 'decw':
    case 'notw':
    case 'negw':
      if (!isValueConnected(block, 'REG')) {
        errors.push({
          blockId: block.id,
          category: ValidationCategories.ESTRUTURAL,
          message,
        });
      }
      break;

    default:
      break;
  }

  return errors;
}

export function checkCompleteness(workspace) {
  const errors = [];

  workspace.getAllBlocks(false).forEach((block) => {
    if (block.isInFlyout || block.isShadow()) return;

    const typesToCheck = [
      'movw',
      'leaw',
      ...THREE_OPERAND_BLOCKS,
      ...SINGLE_OPERAND_BLOCKS,
    ];

    if (typesToCheck.includes(block.type) && isBlockInProgramChain(block)) {
      errors.push(...checkBlockCompleteness(block));
    }
  });

  return errors;
}
