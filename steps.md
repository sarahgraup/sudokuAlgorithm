# steps for sudoku
## 1. figure out how to display 
    1. display by someone clicking start. will show how it does algorithm
    2. can have person do multiple levels of sudoku
        - can click on different levels and press start for each one
    3. figure out what language to use to display?
        - react? figure out best for sudoku image

## 2. write out pseudocode/ steps for algorithm
    1. understand algorithm
    2. write out steps
    3. figure out different rules for functions

## 3. figure out code seperation 
    1. is there a class for the board itself
    2. is there a class for just the algorithm
    3. is there a class for getting the various sudoku from txt files?





---
# cdcl steps/pseudo


## rules
    1. cells must be filled in with a number between 1 and 9
    2. rows can not have duplicates
    3. col can not have duplicates
    4. subsquares can not have duplicates

## Algorithm

    Conflict-Driven Clause Learning (CDCL) is an algorithm primarily used in solving Boolean satisfiability problems (SAT), but it can be adapted for Sudoku as well. Adapting CDCL for Sudoku involves treating Sudoku as a constraint satisfaction problem, which can be mapped to a SAT problem. Here's how CDCL can be applied to Sudoku, along with pseudocode:

### CDCL Steps for Solving Sudoku

    1. **Variable Selection (Decision):**
        - Choose an empty cell in the Sudoku grid.
        - Assign a digit to this cell based on some heuristic (e.g., least number of possible values).
            - doing minimum remaining values/most constrained cells and degree heuristics
            - mrv 
                - Choose the cell with the fewest legal remaining values.
                - This heuristic is effective because it minimizes the chance of choosing a value that leads to a conflict, as fewer choices mean less uncertainty.
            - degree
                - Select the cell that is involved in the highest number of constraints with other unassigned cells.
                - In Sudoku, this could mean choosing a cell in a row, column, or box that has the most empty cells.
        - This is akin to making a 'decision' in CDCL.

    2. **Unit Propagation:**
        - Update the possible values of other cells based on Sudoku rules (rows, columns, and boxes must have unique digits).
        - This step reduces the search space and is similar to unit propagation in SAT, where assignments are propagated to simplify clauses.

    3. **Conflict Detection:**
        - Check if a conflict (contradiction) arises, such as assigning the same number to two cells in the same row, column, or box.
        - If a conflict is detected, backtrack.

    4. **Backtracking (Clause Learning):**
        - When a conflict is detected, identify the decisions and propagations that led to the conflict.
        - Learn a new 'clause' (in SAT terms), which in Sudoku would be a new rule or constraint to avoid repeating the same mistake.
        - Backtrack to an earlier decision point, but with the additional learned constraint.

    5. **Repeat:**
        - Continue the process of decision-making, propagation, conflict detection, and backtracking until the puzzle is solved or deemed unsolvable.

### Pseudocode

```pseudo
function CDCL_Sudoku(grid):
    while not isSudokuSolved(grid) and not isUnsolvable(grid):
        cell, value = selectUnassignedCell(grid)
        assignValue(grid, cell, value)

        propagateConstraints(grid)
        if hasConflict(grid):
            learnedConstraint = analyzeConflict(grid)
            backtrack(grid, learnedConstraint)
        else:
            if not isSudokuSolved(grid):
                continue
            else:
                return grid

    return grid

function propagateConstraints(grid):
    // Propagate Sudoku constraints across rows, columns, and boxes

function hasConflict(grid):
    // Check for any conflicts in the grid

function analyzeConflict(grid):
    // Analyze the conflict and learn a new constraint

function backtrack(grid, learnedConstraint):
    // Backtrack to a previous state, applying the learned constraint
```


### Explanation
- **selectUnassignedCell**: Chooses a cell to assign a value based on a heuristic.
- **assignValue**: Assigns a value to the chosen cell.
- **propagateConstraints**: Propagates the impact of the assignment throughout the grid.
- **hasConflict**: Checks if the current state of the grid has any conflicts.
- **analyzeConflict**: When a conflict is found, this function analyzes it to learn a new constraint.
- **backtrack**: Reverts to a previous state of the grid and applies the newly learned constraint.

In Sudoku, the 'clauses' learned are effectively new constraints or rules derived from the conflicts encountered. This process iteratively refines the approach to solving the puzzle, eventually leading to a solution or determining the puzzle as unsolvable.


## pseudocode for sudoku solver using mrv and degree heurisitcs
```
function SudokuSolver(grid):
    if isSudokuSolved(grid):
        return True

    cell = selectUnassignedCell(grid)

    for value in getPossibleValues(grid, cell):
        if isValidAssignment(grid, cell, value):
            assignValue(grid, cell, value)
            if SudokuSolver(grid):
                return True
            unassignValue(grid, cell)

    return False

function selectUnassignedCell(grid):
    unassignedCells = getUnassignedCells(grid)
    minValues = MAX_INT
    maxDegree = -1
    selectedCell = None

    for cell in unassignedCells:
        numValues = countPossibleValues(grid, cell)
        if numValues < minValues:
            minValues = numValues
            maxDegree = countConstraints(grid, cell)
            selectedCell = cell
        elif numValues == minValues:
            degree = countConstraints(grid, cell)
            if degree > maxDegree:
                maxDegree = degree
                selectedCell = cell

    return selectedCell

function getUnassignedCells(grid):
    // Return a list of all unassigned (empty) cells in the grid

function countPossibleValues(grid, cell):
    // Return the number of possible values for the given cell

function countConstraints(grid, cell):
    // Return the number of constraints involving the given cell
    row, column = getRowAndColumn(cell)
    constraints = 0

    // Count unassigned cells in the same row
    for col in 0 to 8:
        if grid[row][col] is unassigned and col != column:
            constraints += 1

    // Count unassigned cells in the same column
    for r in 0 to 8:
        if grid[r][column] is unassigned and r != row:
            constraints += 1

    // Count unassigned cells in the same 3x3 box
    startRow, startCol = getStartOfBox(row, column)
    for r in startRow to startRow + 2:
        for c in startCol to startCol + 2:
            if grid[r][c] is unassigned and (r != row or c != column):
                constraints += 1

    return constraints

function getRowAndColumn(cell):
    // Return the row and column indices of the cell

function getStartOfBox(row, column):
    // Return the starting row and column indices of the 3x3 box that contains the cell


function isValidAssignment(grid, cell, value):
    // Check if assigning the value to the cell violates Sudoku rules

function assignValue(grid, cell, value):
    // Assign the value to the cell

function unassignValue(grid, cell):
    // Remove the value from the cell, reverting it to unassigned

function isSudokuSolved(grid):
    // Check if the Sudoku is completely and correctly filled
```

## Explanation
    SudokuSolver: The main recursive function for solving the Sudoku. It stops if the Sudoku is solved, otherwise it selects an unassigned cell and tries possible values for that cell.

    selectUnassignedCell: This function implements the MRV and Degree heuristics. It selects the cell with the fewest possible values (MRV). If there's a tie, it then uses the Degree heuristic to select the cell with the most constraints with other unassigned cells.

    getUnassignedCells, countPossibleValues, countConstraints: Helper functions to get unassigned cells, count possible values for a cell, and count the number of constraints involving a cell, respectively.

    isValidAssignment, assignValue, unassignValue: Functions to check if an assignment is valid, assign a value to a cell, and unassign a value from a cell.

    isSudokuSolved: Checks whether the Sudoku puzzle is completely and correctly filled.

    getRowAndColumn: This helper function returns the row and column indices of the given cell.

    Counting Row Constraints: The function iterates over all columns in the given cell's row. If a cell in the same row is unassigned and not the given cell itself, it counts as a constraint.

    Counting Column Constraints: Similarly, it iterates over all rows in the given cell's column, counting unassigned cells as constraints

    Counting Box Constraints: The function determines the starting row and column of the 3x3 box that contains the given cell. It then iterates over the cells in this box, counting unassigned cells as constraints.

    getStartOfBox: This helper function calculates the starting row and column indices of the 3x3 box. For example, for a cell in row 4 and column 5, the starting row and column of its box would be 3 and 3, respectively (considering 0-indexed grid).

   
## creating sudoku board from txt file


```function createSudokuBoardFromFile(filePath):
    grid = initializeEmptyGrid()
    fileContent = readFile(filePath)

    row = 0
    for line in fileContent:
        col = 0
        for char in line:
            if isValidSudokuChar(char):
                grid[row][col] = convertCharToNumber(char)
                col += 1
        row += 1

    if isValidSudokuGrid(grid):
        return grid
    else:
        return "Invalid Sudoku puzzle in file"

function initializeEmptyGrid():
    // Initialize a 9x9 grid with all cells set to an empty value (e.g., 0 or None)

function readFile(filePath):
    // Read the file located at filePath and return its content

function isValidSudokuChar(char):
    // Check if the character is a valid Sudoku character (e.g., '1'-'9', '0', or '.')

function convertCharToNumber(char):
    // Convert the character to the corresponding Sudoku number 
    // (e.g., '1'-'9' to 1-9, '0' or '.' to empty value)

function isValidSudokuGrid(grid):
    // Check if the grid represents a valid Sudoku puzzle
```

## Explanation
    createSudokuBoardFromFile: This is the main function that creates the Sudoku board. It starts by reading the contents of the file and then processes each line to construct the grid.

    initializeEmptyGrid: Initializes a 9x9 grid with all cells set to an empty value.

    readFile: Reads the content of the text file located at the given file path. Each line in the file represents a row in the Sudoku grid.

    isValidSudokuChar: Checks if a character from the file is a valid Sudoku character. It should be a digit (1-9) or a character representing an empty cell (like '0' or '.').

    convertCharToNumber: Converts the character to the corresponding Sudoku number. If the character is '0' or '.', it is converted to an empty value.

    isValidSudokuGrid: After constructing the grid, this function checks if it represents a valid Sudoku puzzle. This includes checking for the correct number of rows and columns and ensuring that the initial numbers don't violate Sudoku rules.


```class SudokuSolver {
    constructor(boardString) {
        this.board = this.parseBoard(boardString);
        this.EMPTY = 0; // Representation of an empty cell
        this.SIZE = 9; // Size of the grid
        this.SUBGRID_SIZE = 3; // Size of the subgrid
    }

    parseBoard(boardString) {
        let board = [];
        let rows = boardString.split("\n");
        for (let row of rows) {
            board.push(row.split("").map(Number));
        }
        return board;
    }

    isSafe(row, col, num) {
        // Check if 'num' is not in the current row, column, and 3x3 subgrid
        for (let x = 0; x < this.SIZE; x++) {
            if (this.board[row][x] === num || this.board[x][col] === num) {
                return false;
            }
        }
        let startRow = row - row % this.SUBGRID_SIZE;
        let startCol = col - col % this.SUBGRID_SIZE;

        for (let i = 0; i < this.SUBGRID_SIZE; i++) {
            for (let j = 0; j < this.SUBGRID_SIZE; j++) {
                if (this.board[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    solve() {
        let emptySpot = this.findEmpty();
        if (!emptySpot) {
            return true; // Solution found
        }
        let [row, col] = emptySpot;

        for (let num = 1; num <= this.SIZE; num++) {
            if (this.isSafe(row, col, num)) {
                this.board[row][col] = num;
                if (this.solve()) {
                    return true;
                }
                this.board[row][col] = this.EMPTY; // Backtrack
            }
        }
        return false; // Trigger backtracking
    }

    findEmpty() {
        for (let row = 0; row < this.SIZE; row++) {
            for (let col = 0; col < this.SIZE; col++) {
                if (this.board[row][col] === this.EMPTY) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    printBoard() {
        for (let row = 0; row < this.SIZE; row++) {
            console.log(this.board[row].join(" "));
        }
    }
}

// Example usage
const boardString = "530070000\n600195000\n098000060\n800060003\n400803001\n700020006\n060000280\n000419005\n000080079";
const solver = new SudokuSolver(boardString);
solver.solve();
solver.printBoard();
```
