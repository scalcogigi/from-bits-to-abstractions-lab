import { checkStructural } from './structural.js';
import { checkSemantic } from './semantic.js';
import { checkArchitectural } from './architectural.js';

export function validateProgram(ast) {
  return [
    ...checkStructural(ast),
    ...checkSemantic(ast),
    ...checkArchitectural(ast)
  ];
}
