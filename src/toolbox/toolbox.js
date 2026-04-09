export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'Operandos',
      'colour': '#8E44AD',
      'contents': [
    { kind: "block", type: "comment" },
		{ kind: "block", type: "reg_A" },
		{ kind: "block", type: "reg_D" },
		{ kind: 'block', type: 'mem' },
		{ kind: 'block', type: 'im' }
      ]
    },
    {
      'kind': 'category',
      'name': 'Instruções',
      'colour': '#2980B9',
      'contents': [
        { kind: "block", type: "comment" },
        { kind: "block", type: "movw" },
        { kind: "block", type: "leaw" },
        { kind: "block", type: "addw" },
        { kind: "block", type: "subw" },
        { kind: "block", type: "rsubw" },
        { kind: "block", type: "incw" },
        { kind: "block", type: "decw" },
        { kind: "block", type: "notw" },
        { kind: "block", type: "nop" },
        { kind: "block", type: "negw" },
        { kind: "block", type: "andw" },
        { kind: "block", type: "orw" },
      ]
    },
    {
      'kind': 'category',
      'name': 'Jumps',
      'colour': '#27AE60',
      'contents': [
        { kind: "block", type: "comment" },
        { kind: "block", type: "label" },
        { kind: "block", type: "jmp" },
        { kind: "block", type: "je" },
        { kind: "block", type: "jne" },
        { kind: "block", type: "jg" },
        { kind: "block", type: "jge" },
        { kind: "block", type: "jl" },
        { kind: "block", type: "jle" },
      ]
    },
  ]
};