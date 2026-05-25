export const MODOS = {
  FIXO: 'fixo',
  LIVRE: 'livre',
};

let modoAtual = MODOS.FIXO;

export function initModoFromUrl() {
  const param = new URLSearchParams(window.location.search).get('modo');
  modoAtual = param === MODOS.LIVRE ? MODOS.LIVRE : MODOS.FIXO;
  return modoAtual;
}

export function getModo() {
  return modoAtual;
}

export function isModoLivre() {
  return modoAtual === MODOS.LIVRE;
}

export function isModoFixo() {
  return modoAtual === MODOS.FIXO;
}

initModoFromUrl();
