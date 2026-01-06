export class ErrorManager {
  constructor(workspace) {
    this.workspace = workspace;
  }

  clearAll() {
    this.workspace.getAllBlocks().forEach(block => {
      block.setWarningText(null);
      if (block.originalColour !== undefined) {
        block.setColour(block.originalColour);
      }
    });
  }

  showErrors(errors) {
  errors.forEach(error => {
    const block = this.workspace.getBlockById(error.blockId);
    if (!block) return;

    block.setWarningText(error.message);

    block.render();
  });
}

}
