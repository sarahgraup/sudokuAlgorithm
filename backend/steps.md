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



The Degree Heuristic is a strategy used in constraint satisfaction problems, including Sudoku, to decide which variable (or cell, in the case of Sudoku) to assign a value to next. The heuristic prioritizes the variable that is involved in the largest number of constraints with unassigned variables. In Sudoku, this translates to selecting the cell that has the most potential impact on the remaining empty cells.

### How Degree Heuristic Works in Sudoku:

1. **Definition of a Constraint**:
   - In Sudoku, a constraint is typically a rule that prohibits duplicating a number in a row, column, or 3x3 subgrid. 
   - For any given cell, constraints are the number of ways this cell's assignment can affect the other unassigned cells in its row, column, and subgrid.

2. **Counting Degree of Constraints**:
   - For each empty cell, count the total number of empty cells in the same row, column, and subgrid. This count is the degree of constraints for that cell. 
   - It's important to count only the unassigned cells, as assigned cells already have a fixed value and do not impose additional constraints.

3. **Selecting the Cell with the Highest Degree**:
   - The cell with the highest degree of constraints is chosen for the next assignment. 
   - The rationale is that assigning a value to this cell will reduce the search space the most, as it influences the largest number of other cells.

### Example:

Consider a Sudoku puzzle:

- Cell A (at row 1, column 1) has 5 empty cells in its row, 4 in its column, and 6 in its subgrid.
- Cell B (at row 3, column 5) has 6 empty cells in its row, 7 in its column, and 5 in its subgrid.

The degree of constraints for Cell A is 5 (row) + 4 (column) + 6 (subgrid) = 15.
For Cell B, it's 6 (row) + 7 (column) + 5 (subgrid) = 18.

Since Cell B has a higher degree of constraints, it would be prioritized for assignment according to the Degree He



### Step-by-Step Process Using MRV and Degree Heuristics:

1. **Initialize the Board**: 
   - Initially, you call `createBoard()` to set up the `row`, `col`, and `subgrid` arrays. This prepares the board for the solving process.

2. **Begin Solving**:
   - Start the solving process by calling `cdclSolver()`.

3. **Check if the Puzzle is Solved**:
   - In `cdclSolver()`, the first thing to do is call `isSudokuSolved()`. If this returns `true`, the puzzle is solved, and the process can end.

4. **Select the Most Constrained Cell**:
   - Use `selectUnassignedCell()` to choose the cell to work on next. This function should apply the MRV and Degree heuristics. It involves:
     - Using `getUnassignedCells()` to find all empty cells.
     - For each empty cell, `countPossibleValues()` to determine the MRV.
     - For each empty cell, `countConstraints()` to determine the Degree.
     - Select the cell with the fewest possible values (MRV) and, in case of a tie, the highest degree of constraints.

5. **Try Filling the Selected Cell**:
   - For the chosen cell, iterate through its possible values. 
   - Check if placing a value is valid using `isValidAssignment()`.
   - If valid, use `assignValue()` to fill in the cell.

6. **Recursive Call to Solve Further**:
   - After assigning a value, make a recursive call to `cdclSolver()`.
   - If the recursive call returns `true`, continue; if it returns `false`, you need to backtrack.

7. **Backtrack if Needed**:
   - If a value leads to a dead end (no valid assignments possible for subsequent cells), use `unassignValue()` to reset the cell and try another value.

8. **Repeat Until Solved or Unsolved**:
   - Continue this process until `isSudokuSolved()` returns `true` (solved) or until all options are exhausted (unsolvable).

9. **Conflict Detection and Learning** (Optional Advanced Steps):
   - Implement `analyzeConflict()` to learn from conflicts, and `propagateConstraints()` to apply constraints across the board. 
   - `hasConflict()` can be used to check if the current board state leads to any conflicts.

10. **Completion**:
   - Once `cdclSolver()` finishes (either by solving the puzzle or determining it's unsolvable), the process is complete.

### Additional Considerations:

- The exact implementation details of functions like `selectUnassignedCell()`, `isValidAssignment()`, and `countConstraints()` are crucial for this process to work effectively.
- This approach provides a structured way to tackle Sudoku puzzles by focusing on the most constrained parts first, thereby reducing the complexity of the problem.





## todo:

1. figure out every route needed for api (api endpoints)
2. alter sudoku backend for routes
3. what if instead of redoing my sudokusolver, i just have it list all steps and then after it is solved it will slowly do it



## Routes

POST ROUTES

POST /api/sudoku/initialize
- Purpose: Initializes a new Sudoku puzzle in the backend with a given board configuration. 
    - This could either load a predefined puzzle or start with an empty board for user input.
- Payload: A Sudoku board array.
- Response: Confirmation message or the initial state of the board.

POST /api/sudoku/solve
- Purpose: Triggers the backend to start solving the currently loaded Sudoku puzzle. 
This can be used after initializing a puzzle or after the user has made manual entries/modifications.
- Response: The solved board or steps leading to the solution,
 depending on whether you want the solution to be instant or step-by-step.


GET ROUTES

- GET /api/sudoku/state
    - Purpose: Retrieves the current state of the Sudoku puzzle, 
    including the board and any relevant solving metadata, 
    like conflicts or decision points.
    - Response: The current board state, possibly including solver steps, conflicts, and decision points if the solving process is ongoing.

- GET /api/sudoku/solverSteps
    - Purpose: Fetches the sequence of steps (assignments, conflicts, backtracks) the solver has taken so far, 
    useful for animating the solving process on the frontend.
    - Response: An array of solver steps with details about each step.

- GET /api/sudoku/conflicts
    - Purpose: Specifically retrieves any conflicts identified by the solver. 
    This could be useful for highlighting conflicts on the frontend.
    - Response: An array of conflicts, each indicating the conflicting value and its location on the board.


- GET /api/sudoku/puzzles/{difficulty}
    - Purpose: Fetches a list of available puzzles of a specified difficulty (e.g., easy, medium, hard).
     This could be useful for users to select puzzles to solve.
    - Response: An array of puzzles, each with a unique identifier and possibly a preview or title.


- GET /api/sudoku/puzzle/{id}
    - Purpose: Retrieves a specific puzzle by its ID, allowing users to load and solve it.
    - Response: The board configuration of the requested puzzle.

