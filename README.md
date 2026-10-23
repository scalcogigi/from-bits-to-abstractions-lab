# Analyzing the Use of Visual Programming in Teaching Assembly

This project aims to explore the use of block-based visual programming as a supporting tool for teaching Assembly language. The proposal seeks to understand how the visual representation of low-level instructions can contribute to learning fundamental computer architecture concepts, reducing syntactic complexity and improving content accessibility.

The developed application integrates the Blockly environment—an open-source visual programming library—with custom Assembly and JSON code generators. This allows students to build programs by dragging and arranging visual blocks while simultaneously observing the automatic translation into Assembly code, encouraging a practical understanding of the logic behind machine-level operations.

## Educational Objective

The use of visual tools in Assembly education aims to make learning more intuitive and exploratory, promoting conceptual understanding of processes such as:

- Data movement between registers and memory;
- Execution of arithmetic and logical operations;
- Control flow mechanisms (conditional jumps and labels);
- Symbolic representation of the machine’s internal architecture.

Through this approach, the project seeks to bring students closer to the foundations of low-level programming, allowing the focus to shift from syntactic memorization to the logic and structure of instructions.

## Conclusion

The project “Analyzing the Use of Visual Programming in Teaching Assembly” proposes an innovative and interactive approach to teaching concepts traditionally considered complex. By combining block-based visualization with automatic translation to Assembly, students can incrementally understand the correspondence between high-level logic and its representation in machine-level code.

## Deployment link

http://3.134.105.93:3000

## Local Execution

To run the project locally, Node.js and npm (Node Package Manager) must be installed on your system.

### 2.1. Clone the repository
```bash
git clone https://github.com/scalcogigi/blocos-e-bits.git
cd blocos-e-bits
```

### 2.2. Install dependencies
```bash
npm install
```

### 2.3. Run the development server
```bash
npm start
```

The project will start in development mode and can be accessed by default at:
```bash
http://localhost:3000/
```

## Technologies Used
Blockly

JavaScript

Node.js / npm

Webpack / Babel

HTML / CSS / Tailwind

License
This project is licensed under the terms of the MIT License.
Use, modification, and redistribution of the code are permitted, provided that the original author credits are maintained.

Copyright (c) 2025 Giovanna Barros Scalco
