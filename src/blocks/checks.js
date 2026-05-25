import { isModoLivre } from '../mode.js';

/** No modo livre aceita qualquer encaixe; no fixo aplica os tipos da ISA. */
export function typeCheck(allowed) {
  return isModoLivre() ? null : allowed;
}
