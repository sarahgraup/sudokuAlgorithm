"use strict";

/**Express app for sudoku solver */

const express = require("express");
const { Sudoku } = require('./sudoku');
const { NotFoundError, BadRequestError } = require("./expressError");
const app = express();

const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/sudoku", sudokuRoutes);


const PORT = process.env.PORT || 3000;

/** POST /sudoku { file } => { board }
 * 
 * returns initial state of newly created board or error message 
 * 
 */
app.post('/sudoku', async (req, res) => {
  const { difficulty } = req.body; // Assuming difficulty is sent in the request body
  const file = path.join('./sudokus', `${difficulty}.txt`); // Assuming puzzles are stored in a "puzzles" directory


  try {
    const sudoku = await Sudoku.getSudoku(file);
    res.json({ board: sudoku.board }); // Send the initial state of the board
  } catch (error) {
    res.status(500).send('Failed to load the Sudoku puzzle.');
  }
});

/** GET /solve/:difficulty => {steps: {actiontype:..., {row, col, val, boardstate} }, {...}, ...}
 * 
 */
app.get('/solve/:difficulty', async (req, res) => {
  const { difficulty } = req.params;
  const file = path.join('./sudokus', `${difficulty}.txt`);
  // const file = path.join(__dirname, 'puzzles', `${difficulty}.txt`);

  try {
    const sudoku = await Sudoku.getSudoku(file);
    sudoku.createBoard(); // Ensure the board is initialized
    const solved = sudoku.cdclSolver(); // Solve the Sudoku
    if (solved) {
      return res.json({ steps: sudoku.getActionLog() }); // Send back all steps
    } else {
      res.status(500).send('Failed to solve the Sudoku puzzle.');
    }
  } catch (error) {
    res.status(500).send('Failed to process the Sudoku puzzle.');
  }
});


/** 404 handler: matches unmatched routes. */
app.use(function (req, res) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



module.exports = app;










