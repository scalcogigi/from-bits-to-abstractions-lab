import { checkStructural } from './structural.js';
import { checkSemantic } from './semantic.js';
import { checkArchitectural } from './architectural.js';
import { checkCompleteness } from './completeness.js';
import { isModoLivre } from '../mode.js';

export { isModoLivre } from '../mode.js';

export function validateProgram(ast, workspace) {
  if (isModoLivre()) {
    return [];
  }

  const completenessErrors = workspace
    ? checkCompleteness(workspace)
    : [];

  return [
    ...completenessErrors,
    ...checkStructural(ast),
    ...checkSemantic(ast),
    ...checkArchitectural(ast, workspace),
  ];
}
