export function buildAST(workspace) {
  const instructions = [];

  const topBlocks = workspace.getTopBlocks(true);

  topBlocks.forEach(top => {
    let current = top;

    while (current) {
      if (current.previousConnection && current.nextConnection) {
        instructions.push({
          id: current.id,
          type: current.type,
          args: extractArgs(current)
        });
      }

      current = current.getNextBlock();
    }
  });

  return { instructions };
}


function extractArgs(block) {
  const args = [];

  block.inputList.forEach(input => {
    if (input.connection && input.connection.targetBlock()) {
      const child = input.connection.targetBlock();

      switch (true) {
        case child.type === 'mem':
          args.push('(%A)');
          break;

        case child.type.startsWith('reg_'): {
          const reg = child.type.split('_')[1];
          args.push(`%${reg}`);
          break;
        }

        case child.type === 'im':
          args.push(child.getFieldValue('VALUE'));
          break;

        default:
          args.push(child.type);
      }
    }
  });

  return args;
}
