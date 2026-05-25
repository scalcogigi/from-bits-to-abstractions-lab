export function immediateFromField(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const num = Number(value);
  if (!Number.isInteger(num)) {
    return null;
  }

  return `$${num}`;
}

export function parseImmediateArg(arg) {
  if (typeof arg !== 'string' || !arg.startsWith('$')) {
    return null;
  }

  const raw = arg.slice(1);
  if (raw === '' || raw === 'undefined' || raw === 'null') {
    return null;
  }

  const num = Number(raw);
  return Number.isInteger(num) ? num : null;
}
