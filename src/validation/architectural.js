import { ValidationCategories } from './types.js';
import { parseImmediateArg } from '../utils/immediate.js';

function movwDestIsRegisterA(workspace, instr) {
  const block = workspace.getBlockById(instr.id);
  if (!block || block.type !== 'movw') return false;

  const destBlock = block.getInputTargetBlock('DEST');
  return destBlock?.type === 'reg_A';
}

export function checkArchitectural(ast, workspace = null) {
  const errors = [];

  // Helper semânticos

  function isMemory(arg) {
    return arg === '(%A)';
  }

  function isImmediate(arg) {
    return typeof arg === 'string' && arg.startsWith('$');
  }

  const ISA_IMMEDIATE_MAX = 65535;
  const ISA_SMALL_IMMEDIATES = new Set([-1, 0, 1]);

  function isValidIsaImmediate(arg) {
    if (!isImmediate(arg)) return true;

    const num = parseImmediateArg(arg);
    if (num === null) return true;

    if (ISA_SMALL_IMMEDIATES.has(num)) return true;
    return num >= 2 && num <= ISA_IMMEDIATE_MAX;
  }

  // Leitura + escrita de memória no mesmo ciclo

  const instructionsThatWrite = [
    'movw',
    'addw',
    'subw',
    'andw',
    'orw'
  ];

  ast.instructions.forEach(instr => {
    if (!instructionsThatWrite.includes(instr.type)) return;
    if (!instr.args || instr.args.length < 2) return;

    const readsMemory = instr.args.slice(0, -1).some(isMemory);
    const writesMemory = isMemory(instr.args[instr.args.length - 1]);

    if (readsMemory && writesMemory) {
      errors.push({
        blockId: instr.id,
        category: ValidationCategories.ARQUITETURAL,
        message:
          'Esta instrução tenta ler e escrever na memória no mesmo ciclo.\n' +
          'Na arquitetura Z01 isso não é permitido.\n\n' +
          'Sugestão:\n' +
          'leaw (%A), %D\n' +
          'addw %D, %D, (%A)'
      });
    }
  });

  // Jump condicional sem flags válidas

  const conditionalJumps = ['je', 'jne', 'jg', 'jge', 'jl', 'jle'];
  const aluInstructions = [
    'addw', 'subw', 'andw', 'orw',
    'negw', 'notw', 'incw', 'decw'
  ];

  let flagsValid = false;

  ast.instructions.forEach(instr => {
    if (aluInstructions.includes(instr.type)) {
      flagsValid = true;
      return;
    }

    if (conditionalJumps.includes(instr.type)) {
      if (!flagsValid) {
        errors.push({
          blockId: instr.id,
          category: ValidationCategories.ARQUITETURAL,
          message:
            'Este jump condicional depende das flags do processador,\n' +
            'mas nenhuma instrução anterior as definiu.\n\n' +
            'Sugestão:\n' +
            'Execute uma operação aritmética antes do jump.'
        });
      }
    }
  });

  // Uso inválido do registrador %A como destino

  const invalidADestination = [
    'addw', 'subw', 'andw', 'orw',
    'incw', 'decw', 'negw', 'notw'
  ];

  ast.instructions.forEach(instr => {
    if (!invalidADestination.includes(instr.type)) return;
    if (!instr.args || instr.args.length < 2) return;

    const dst = instr.args[instr.args.length - 1];

    if (dst === '%A') {
      errors.push({
        blockId: instr.id,
        category: ValidationCategories.ARQUITETURAL,
        message:
          'O registrador %A não pode ser usado como destino desta instrução.\n' +
          '%A é dedicado ao endereçamento de memória na arquitetura Z01.\n\n' +
          'Sugestão:\n' +
          'Use %D como destino.'
      });
    }
  });

  if (workspace) {
    ast.instructions.forEach(instr => {
      if (instr.type !== 'movw') return;
      if (!movwDestIsRegisterA(workspace, instr)) return;

      errors.push({
        blockId: instr.id,
        category: ValidationCategories.ARQUITETURAL,
        message:
          'O registrador %A não pode ser usado como destino de movw.\n' +
          '%A pode aparecer no segundo operando, mas não no campo de destino.\n\n' +
          'Sugestão:\n' +
          'Use %A em SRC2 ou use %D / memória em DEST.'
      });
    });
  }

  // Imediatos inválidos ($-1/$0/$1 ou constantes $0–$65535)

  ast.instructions.forEach(instr => {
    if (!instr.args) return;

    instr.args.forEach(arg => {
      if (isValidIsaImmediate(arg)) return;

      errors.push({
        blockId: instr.id,
        category: ValidationCategories.ARQUITETURAL,
        message:
          `O valor imediato ${arg} não é válido na ISA Z01.\n` +
          'Use o bloco imediato ($0, $1, $-1) ou constante ($0 a $65535).\n\n' +
          'Sugestão:\n' +
          'Troque o operando ou ajuste o valor.'
      });
    });
  });

  return errors;
}
