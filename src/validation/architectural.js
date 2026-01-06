import { ValidationCategories } from './types.js';

export function checkArchitectural(ast) {
  ast.instructions.forEach(instr => {
  console.log("DEST CHECK:", instr.type, instr.args);
});

  const errors = [];

  // Helper semânticos

  function isMemory(arg) {
    return arg === '(%A)';
  }

  function isImmediate(arg) {
    return typeof arg === 'string' && arg.startsWith('$');
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

  // Imediatos inválidos

  const validImmediates = ['$0', '$1', '$-1'];

  ast.instructions.forEach(instr => {
    if (!instr.args) return;

    instr.args.forEach(arg => {
      if (isImmediate(arg) && !validImmediates.includes(arg)) {
        errors.push({
          blockId: instr.id,
          category: ValidationCategories.ARQUITETURAL,
          message:
            `O valor imediato ${arg} não existe na arquitetura Z01.\n` +
            'A ISA suporta apenas $0, $1 e $-1.\n\n' +
            'Sugestão:\n' +
            'Construa valores maiores usando operações aritméticas.'
        });
      }
    });
  });

  return errors;
}
