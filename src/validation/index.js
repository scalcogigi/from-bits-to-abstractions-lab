import { checkStructural } from './structural.js';
import { checkSemantic } from './semantic.js';
import { checkArchitectural } from './architectural.js';

let modoLivre = false;

export function setModoLivre(valor) {
  modoLivre = valor;
}

export function validateProgram(ast) {
  if (modoLivre) {
    return [];
  }

  return [
    ...checkStructural(ast),
    ...checkSemantic(ast),
    ...checkArchitectural(ast)
  ];
}