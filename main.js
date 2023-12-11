const fsP = require('fs/promises');
const {Sudoku} = require("./sudoku");







async function main() {
  let board;
  try {
      board = await Sudoku.getSudoku("sudokus/s01a.txt");
      
      // Further operations with sudokuSolver
  } catch (err) {
      console.error("Failed to load Sudoku:", err);
      process.exit(1);
  }

 board.createBoard(board);


}

main();