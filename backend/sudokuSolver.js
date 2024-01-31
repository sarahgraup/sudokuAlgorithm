"use strict";
const fsP = require('fs/promises');

class Sudoku {
    /**
     * Creates a new Sudoky puzzle instance from a provided board
     */
    constructor(board) {
        this.empty = new Set();
        this.row = [];
        this.col = [];
        this.subgrid = [];
        this.board = board;
        this.boardSize = 9;
        this.subgridSize = 3;
        this.posValues = {};
        this.conflict = {};
        this.watchedLiterals = {};
        this.conflictHistory = [];
        this.assignedCells = [];
        this.decisionPoints = [];
        //add control mechanisms for pause and resume solving process
        this.isPaused = false;
        this.currentStep = null; //used for forward/backward functionality
        this.solveQueue = []; // Queue of steps to solve
        this.isSolving = false; // Indicates if the solving process is active
        this.solveHistory = [];

    }

    /**
     * Reads a Sudoku board from a text file and returns a Sudoku instance.
     * @param {string} file - The file path to the text file containing the Sudoku board.
     * @returns {Promise<Sudoku>} A promise that resolves to a Sudoku instance.
     */
    static async getSudoku(file) {

        let contents;
        try {
            contents = await fsP.readFile(`${file}`, "utf8");

        } catch (err) {
            process.exit(1);
        }

        const board = contents.split(/\r\n|\r|\n/).map(r => r.trim().replace(/\s+/g, ' ')).filter(r => r !== '').map(c => c.split(' ').map(Number));

        return new Sudoku(board);
    }

     /**
     * Initializes the Sudoku board by setting up row, column, and subgrid data structures.
     */
    createBoard() {

        for (let i = 0; i < this.boardSize; i++) {
            this.subgrid.push([]);
        }

        for (let r = 0; r < this.boardSize; r++) {
            this.row.push(this.board[r]);
            this.col.push([]);

            for (let c = 0; c < this.boardSize; c++) {

                this.col[r].push(this.board[c][r]);
                const subgridIndex = this.getSubgridIndex(r, c);
                this.subgrid[subgridIndex].push(this.board[r][c]);
            }
        }

    }

     /**
     * Calculates the index of the subgrid based on the row and column.
     * @param {number} r - The row index.
     * @param {number} c - The column index.
     * @returns {number} The index of the subgrid.
     */
    getSubgridIndex(r, c) {
        const subgridRow = Math.floor(r / this.subgridSize);
        const subgridCol = Math.floor(c / this.subgridSize);
        const subgridIndex = subgridRow * this.subgridSize + subgridCol;

        return subgridIndex;
    }

     /**
     * The main recursive Conflict-Driven Clause Learning (CDCL) algorithm for solving Sudoku.
     * @returns {boolean} True if the Sudoku is solved, false otherwise.
     */
    cdclSolver() {
        //check if sudoku is already solved
        if (this.isSudokuSolved()) {
            console.log(this.board);
            return true;
        }

        //update pos values for each cell
        this.calculatePossibleValues();

        // First, assign single-element values
        while (this.assignSingleElements()) {
            this.calculatePossibleValues(); // Recalculate after assignments

            if (this.hasConflict()) {
                //apply learned clauses from conflict
                if (this.analyzeConflict()) {
                    return false; //trigger backgtacking due to conflict 
                }
            }
        }

        if (this.isSudokuSolved()) {
            console.log(this.board);
            return true;
        }

        console.log("board", this.board);


        let bestCells = this.cellWithMinimumRemainingValues();
        let bestCell = null;

        if (bestCells.length === 1) {
            bestCell = bestCells[0];
        } else if (bestCells.length > 1) { //if tie for best cells - apply degree heuristics
            bestCell = this.applyDegreeHeuristics(bestCells);
        }
        if (!bestCell) {
            return false; // No viable cell found, trigger backtracking
        }

        //calculate least constraining values for the chosen cell
        let { r, c } = bestCell;
  
        //creates array with objects of its value and score
        let valueScores = this.posValues[r][c].map(value => {
            return {
                value: value,
                score: this.calculateConstrainingValue(r, c, value)
            };
        });

        //sort values based on their scores
        valueScores.sort((a, b) => a.score - b.score);

        //get sorted values
        let leastConstrainingValues = valueScores.map(cell => cell.value);

        for (let value of leastConstrainingValues) {
            this.recordDecisionPoint(r, c, value);
            this.assignValue(r, c, value);
            console.log("the board", this.board);

            if (this.cdclSolver()) {
                console.log("the cdcl solver is true");
                return true; //solution found;
            } else {
                this.unassignValue(r, c, value); //backtrack;

            }
        }

        return false; //triggers backtracking 

    }

    /**
     * Records the current state of the board and decision point.
     * @param {number} r - Row index of the decision cell.
     * @param {number} c - Column index of the decision cell.
     * @param {number} val - Value assigned to the decision cell.
     */
    recordDecisionPoint(r, c, val) {
        const decisionPoint = {
            row: r,
            col: c,
            val: val,
            boardState: this.copyBoardState(), // Record the current state of the board
            rowState: this.copyRowState(),
            colState: this.copyColState(),
            subgridState: this.copySubgridState()
        };
        this.decisionPoints.push(decisionPoint);
    }

   /**
     * Assigns values to cells with only one possible value and returns whether such cells were found.
     * @returns {boolean} True if a single-element assignment was made, false otherwise.
     */
    assignSingleElements() {
        let foundSingleElement = false;

        if (Object.keys(this.posValues).length === 0) {
            console.log("pos values is empty");
            return foundSingleElement;
        }

        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (this.board[r][c] === 0 && this.posValues[r][c].length === 1) {
                    foundSingleElement = true;
                    this.assignValue(r, c, this.posValues[r][c][0]);
                }
            }
        }
        return foundSingleElement;
    }

     /**
     * Finds and returns cells with the minimum remaining possible values.
     * @returns {Array<Object>} An array of cell objects, each with row (r) and column (c) properties.
     *      [{ r: 2, c: 3 }, { r: 5, c: 6 }, {...}] 
     * 
     */
    cellWithMinimumRemainingValues() {
        let numMinOptions = Infinity;
        let bestCells = [];

        for (let cell of this.empty) {
            let [r, c] = cell.split('-').map(Number);
            const options = this.posValues[r][c].length;
            if (options < numMinOptions) {
                numMinOptions = options;
                bestCells = [{ r, c }];
            } else if (options === numMinOptions) {
                bestCells.push({ r, c });
            }
        }
        return bestCells;
    }

    /**
     * Applies the degree heuristic to select the most constrained cell.
     * @param {Array<Object>} bestCells - An array of candidate cells.
     * @returns {Object|null} The cell with the highest degree of constraints, or null if none found.
     */
    applyDegreeHeuristics(bestCells) {
        let maxDegree = -1;
        let bestCell = null;

        for (let cell of bestCells) {
            const degree = this.countConstraints(cell.r, cell.c);
            if (degree > maxDegree) {
                maxDegree = degree;
                bestCell = cell;
            }
        }

        return bestCell;
    }



     /**
     * Chooses the least constraining value for a given cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @returns {number|null} The least constraining value, or null if none found.
     */
    chooseLeastConstrainingValue(r, c) {
        let minConstrainingValue = Infinity;
        let bestValue = null;
        const possibleValues = this.posValues[r][c];

        for (let val of possibleValues) {
            let constrainingValue = this.calculateConstrainingValue(r, c, val);
            if (constrainingValue < minConstrainingValue) {
                minConstrainingValue = constrainingValue;
                bestValue = val;
            }
        }

        return bestValue;
    }


     /**
     * Calculates the constraining impact of a potential value for a cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The potential value for the cell.
     * @returns {number} The number of constraints the value would add.
     */
    calculateConstrainingValue(r, c, val) {
        //constraint counter tracks how many possible values for other cells are eliminated if val is placed
        let constraints = 0;
        const targetSubgridIndex = this.getSubgridIndex(r, c);

        this.empty.forEach(cell => {
            let [cellRow, cellCol] = cell.split('-').map(Number);
            const cellSubgridIndex = this.getSubgridIndex(cellRow, cellCol);

            //check if cell is in same row, column or subgrid as [r,c]
            const isInSameRow = cellRow === r && cellCol !== c;
            const isInSameCol = cellCol === c && cellRow !== r;
            const isInSameSubgrid = cellSubgridIndex === targetSubgridIndex && (cellRow !== r || cellCol !== c);

            //increments constrainst if the value is a possible value for the empty cell
            if ((isInSameRow || isInSameCol || isInSameSubgrid) && this.posValues[cellRow][cellCol].includes(val)) {
                constraints++;
            }
        });

        return constraints;
    }


    /**
     * Calculates the possible values for each empty cell on the Sudoku board.
     */
    calculatePossibleValues() {
        this.empty.clear();

        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (this.board[r][c] === 0) {
                    this.empty.add(`${r}-${c}`);
                    let validOptions = this.getValidOptions(r, c);
                    if (!(r in this.posValues)) {
                        this.posValues[r] = {}

                    }
                    this.posValues[r][c] = validOptions;

                }
            }
        }
    }

     /**
     * Determines valid candidate values for a specific cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @returns {Array<number>} An array of valid values for the cell.
     */
    getValidOptions(r, c) {
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let validOptions = options.filter(val => this.isValidAssignment(r, c, val));
        return validOptions;
    }

     /**
     * Checks if a value can be legally assigned to a specified cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The value to check.
     * @returns {boolean} True if the assignment is valid, false otherwise.
     */
    isValidAssignment(r, c, val) {
        return (
            !this.isInRow(r, c, val) &&
            !this.isInCol(r, c, val) &&
            !this.isInSubgrid(r, c, val)

        );
    }


    /**
     * Checks if a value is already in the same row of a cell.
     * @param {number} r - Row index of the cell.
     * @param {number} excludeCol - Column index to exclude from the check.
     * @param {number} val - The value to check.
     * @returns {boolean} True if the value is in the row, false otherwise.
     */
    isInRow(r, excludeCol, val) {
        return this.row[r].some((cellVal, colIndex) => colIndex !== excludeCol && cellVal === val);

    }

    /**
     * Checks if a value is already in the same column of a cell.
     * @param {number} excludeRow - Row index to exclude from the check.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The value to check.
     * @returns {boolean} True if the value is in the column, false otherwise.
     */
    isInCol(excludeRow, c, val) {
        for (let r = 0; r < this.boardSize; r++) {
            if (r !== excludeRow) {
                if (this.col[c][r] === val) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if a value is already in the same subgrid of a cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The value to check.
     * @returns {boolean} True if the value is in the subgrid, false otherwise.
     */
    isInSubgrid(r, c, val) {
        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);

        return this.subgrid[subgridIndex].some((cellVal, index) => index !== positionInSubgrid && cellVal === val);
    }

   /**
     * Counts the number of constraints involving a specific cell.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @returns {number} The number of constraints.
     */
    countConstraints(r, c) {
        console.log("in count constraints");
        let constraints = 0;

        this.row[r].forEach((val, index) => {
            if (val === 0 && index !== c) {
                constraints++;
            }

        });

        this.col[c].forEach((val, index) => {
            if (val === 0 && index !== r) {
                constraints++;
            }
        });

        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);

        this.subgrid[subgridIndex].forEach((val, index) => {
            if (val === 0 && index !== positionInSubgrid) {

                constraints++;
            }
        });

        return constraints;
    }

     /**
     * Assigns a value to a specific cell in the Sudoku board.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The value to assign.
     */
    assignValue(r, c, val) {

        this.board[r][c] = val;
        this.row[r][c] = val;
        this.col[c][r] = val;
      
        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);
        this.subgrid[subgridIndex][positionInSubgrid] = val;

        delete this.posValues[r][c];

        this.empty.delete(`${r}-${c}`);

        if (Object.keys(this.posValues[r]).length === 0) {
            delete this.posValues[r];
        }

    }

    /**
     * Checks if there is a conflict in the current state of the Sudoku board.
     * @returns {boolean} True if there is a conflict, false otherwise.
     */
    hasConflict() {
        console.log("in has conflict");
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (this.board[r][c] !== 0 && !this.isValidAssignment(r, c, this.board[r][c])) {
                    return true;
                }
                if (this.board[r][c] === 0 && this.posValues[r][c].length === 0) {
                    return true;
                }

            }
        }

        return false;
    }


    /**
     * Analyzes a conflict and modifies the state based on the analysis.
     * @returns {boolean} True if a conflict is analyzed successfully, false otherwise.
     */
    analyzeConflict() {
        console.log("in analyze conflict");
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                //if the cell isnt empty and is not a valid assignment then push to conflict
                if (this.board[r][c] !== 0 && !this.isValidAssignment(r, c, this.board[r][c]) || this.board[r][c] === 0 && this.posValues[r][c].length === 0) {
                    if (!(r in this.conflict)) {
                        this.conflict[r] = {};
                    }
                    if (!(c in this.conflict[r])) {
                        this.conflict[r][c] = [this.board[r][c]];
                    } else {
                        this.conflict[r][c].push(this.board[r][c]);

                    }
                    return true;
                }
            }
        }

        return false;

    }

   /**
     * Removes a previously assigned value from a cell, reverting it to unassigned.
     * @param {number} r - Row index of the cell.
     * @param {number} c - Column index of the cell.
     * @param {number} val - The value to remove.
     * @returns {boolean} True if backtracking is successful, false if there are no more decisions to backtrack from.
     */
    unassignValue(r, c, val) {
  
        if (this.decisionPoints.length === 0) {
            return false; // No more decisions to backtrack from
        }
        const lastDecision = this.decisionPoints.pop();
        this.board = lastDecision.boardState; // Revert to the previous board state
        this.row = lastDecision.rowState;
        this.col = lastDecision.colState;
        this.subgrid = lastDecision.subgridState

        this.calculatePossibleValues();
    }

     /**
     * Creates a deep copy of the current board state.
     * @returns {Array<Array<number>>} A deep copy of the board.
     */
    copyBoardState() {
        return this.board.map(row => [...row]); 
    }

     /**
     * Creates a deep copy of the current row state.
     * @returns {Array<Array<number>>} A deep copy of the row state.
     */
    copyRowState() {
        return this.row.map(r => [...r]); 
    }

     /**
     * Creates a deep copy of the current col state.
     * @returns {Array<Array<number>>} A deep copy of col state.
     */
    copyColState() {
        return this.col.map(c => [...c]); 
    }

     /**
     * Creates a deep copy of the current subgrid state.
     * @returns {Array<Array<number>>} A deep copy of the subgrid state.
     */
    copySubgridState() {
        return this.subgrid.map(sub => [...sub]); 
    }

    /**
     * Checks if the Sudoku puzzle is completely and correctly filled.
     * @returns {boolean} True if the Sudoku is solved, false otherwise.
     */
    isSudokuSolved() {
        console.log("in is sudoku solved");
        for (let r = 0; r < this.row.length; r++) {
            for (let c = 0; c < this.col.length; c++) {
                if (this.board[r][c] === 0) {
                    console.log("it returns false");
                    return false;
                }
            }
        }
        return true;

    }

    pause(){
        this.isPaused = true;
    }

    play(){
        if(this.isPaused){
            this.isPaused = false;
            this.processSolveQueue();

        }
        
    }

    processSolveQueue(){
        if(this.isPaused || this.processSolveQueue.length === 0 || this.isSudokuSolved()){
            this.isSolving = false;
            return;
        }

        this.isSolving = true;
        const { r, c, value } = this.solveQueue.shift(); // Get the next step
        this.assignValue(r, c, value);
        this.calculatePossibleValues(); // Recalculate possible values after assignment

        // Schedule the next step
        setTimeout(() => this.processSolveQueue(), 0); // Use setTimeout to prevent stack overflow

    }

    forward(){
        if(this.solveQueue.length === 0){
            return false; //no steps left to process
        }
        const {cell, value} = this.solveQueue.shift(); //deque next step 
        this.assignValue(cell.row, cell.col, value);
        this.calculatePossibleValues();

        this.solveHistory.push({cell, value}); 
        return true;

    }

    backward() {
        if(this.solveHistory.length === 0 ){
            return false; //no steps to undo
        }
        const {cell, value} = this.solveHistory.pop(); //removing last step
        this.unassignValue(cell.row, cell.col, value);
        this.calculatePossibleValues();
        return true;
      
    }
    //add solving step to queue
    enqueueSolveStep(cell, value) {
        this.solveQueue.push({ cell, value });
    }
}

module.exports = { Sudoku };