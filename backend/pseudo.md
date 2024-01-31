## cdcl solver 
    calls isSudokuSolved
    if not, then calls get unassigned cell
    - call num possible values
    - loop through and check if any of them have just 1 possible
        - if it does- call assignValue and call get unassigned cell again
    



## get unassigned cell
    - it gets all unassigned cells- array of them 
    - maybe do object instead? bc then you can do {1:[], 2:[]}
    - returns that 

## num pos values
    - maybe this should be object as well
    - calls is valid assignment
    - checks isinrow, col, subgrid


## select Unassigned cell

    needs to check for only the one options first


```

selectUnassignedCell(){

    arr = [[1,2], [1,5], [2,2], [2,4]]


    obj = {
        1: [
            2:[1,5,9],  5: [2]           
        ]
    }

    obj = { 1:[2, 5], 2:[2, 4] }

    {1:[]}




    }




    call getUnassignedCells();

    call numPossibleValues probably make obj

    if one has only have length 1 of arra, call assignValue

    do getUnassignedCells again


    // Assuming the same mockup functions (getUnassignedCells, numPossibleValues, assignValues) are defined

    // Recursive function
    function selectUnassignedCell() {
        let unassignedCells = getUnassignedCells();

        // Check if all unassigned cells have more than one possible value
        if (unassignedCells.every(cell => cell.length > 1)) {
            console.log("All unassigned cells have more than one possible value");
            return; // Base case
        }

        let possibleValues = numPossibleValues(unassignedCells);
        let assignmentsMade = false;

        for (let cell of Object.keys(possibleValues)) {
            if (possibleValues[cell].length === 1) {
                assignValues(cell, possibleValues[cell][0]);
                assignmentsMade = true;
            }
        }

        // Recursive call, regardless of whether assignments were made
        selectUnassignedCell(); 
    }

    // Example usage
    selectUnassignedCell();








```



degree heuristics

loop through the empty object and check for each value the num of possible values
find the one with least num of possible values


if there are cells that have equal num of least possible values, add them to an array and then count constrainst for it
check which constraint degree is greater. 





two different loops
first loop is find the one with least num of possible values

then find ones with equal num of pos values, and get degrees 












```
"use strict";
const fsP = require('fs/promises');




class Sudoku {
    constructor(board) {
        this.empty = new Set();
        this.row = [];
        this.col = [];
        this.subgrid = [];
        this.board = board;
        this.boardSize = 9;
        this.subgridSize = 3;
        this.posValues = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
        this.watchedLiterals = {};
        this.conflictHistory = [];
        this.assignedCells = [];

    }

    /**  */
    static async getSudoku(file) {

        let contents;
        try {
            contents = await fsP.readFile(`${file}`, "utf8");

        } catch (err) {
            process.exit(1);
        }

        const board = contents.split('\r\n').map(r => r.trim()).map(c => c.split(' ').map(Number));

        return new Sudoku(board);
    }

    /**initilizes sudoku board with new board */
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

    /**returns subgrid index based on row and col */
    getSubgridIndex(r, c) {
        const subgridRow = Math.floor(r / this.subgridSize);


        const subgridCol = Math.floor(c / this.subgridSize);

        const subgridIndex = subgridRow * this.subgridSize + subgridCol;


        return subgridIndex;


    }

    /**main function that calls helper functions to solve sudoku 
     * The main recursive function for solving the Sudoku. It stops if the Sudoku is solved, 
     * otherwise it selects an unassigned cell and tries possible values for that cell.
    */
    cdclSolver() {
        if (this.isSudokuSolved()) {
            return true;
        }

        let foundSingleElement = false;

        // this.getUnassignedCells();
        // this.calculatePossibleValues();
        // if (this.calculatePossibleValues()) {
        //     console.log("Conflict detected, starting analysis and backtrack.");
        //     const lastConflict = this.analyzeConflict();
        //     if (!this.backTrack(lastConflict)) {
        //         console.log("Sudoku is unsolvable due to unresolvable conflict.");
        //         return false;
        //     }
        //     return this.cdclSolver();
        // }
        console.log("conflict hisotry:", this.conflictHistory);
        console.log("in cdcl solver num possible values is:", this.posValues);

       
        if (this.hasConflict() || this.conflictHistory.length!==0) {
            //figure out while loop- SO WHILE HAS CONFLICT, NEED TO ANALYZE CONFLICT AND "BACKTRACK"
            console.log("yes conflict");
            const lastConflict = this.analyzeConflict();
            if (!this.backTrack(lastConflict)) {
                console.log("Sudoku is unsolvable due to unresolvable conflict.");
                return false;
            }
            return this.cdclSolver();

        }

        this.getUnassignedCells();
        this.calculatePossibleValues();
        if (this.hasConflict() || this.conflictHistory.length!==0) {
            //figure out while loop- SO WHILE HAS CONFLICT, NEED TO ANALYZE CONFLICT AND "BACKTRACK"
            console.log("yes conflict");
            const lastConflict = this.analyzeConflict();
            if (!this.backTrack(lastConflict)) {
                console.log("Sudoku is unsolvable due to unresolvable conflict.");
                return false;
            }
            return this.cdclSolver();

        }

        foundSingleElement = this.assignSingleElements(foundSingleElement);
        console.log(this.board);

        if (this.hasConflict() || this.conflictHistory.length!==0) {
            //figure out while loop- SO WHILE HAS CONFLICT, NEED TO ANALYZE CONFLICT AND "BACKTRACK"
            console.log("yes conflict");
            const lastConflict = this.analyzeConflict();
            if (!this.backTrack(lastConflict)) {
                console.log("Sudoku is unsolvable due to unresolvable conflict.");
                return false;
            }
            return this.cdclSolver();

        }


        if (foundSingleElement === false) {
            if (this.isSudokuSolved()) {
                return true;
            } else {
                console.log(this.board);
                this.degreeHeuristics();
                console.log("it does tho");
                return this.cdclSolver();
                // if (this.hasConflict()) {
                //     console.log("yup conflict");
                //     const lastConflict = this.analyzeConflict();
                //     if (!this.backTrack(lastConflict)) {
                //         // Backtracking failed, the Sudoku is unsolvable.
                //         console.log("Sudoku is unsolvable.");
                //         return false;
                //     }
                // }
                // else {
                //     console.log("it returns false so we call cdcl solver again");
                //     return this.cdclSolver();
                // }
            }
        } else {
            console.log(this.board);
            console.log("it has found a single element so keep looping");
            return this.cdclSolver();
        }

    }

    assignSingleElements(foundSingleElement) {
        console.log("in assign single elements");
        for (let rowKey of Object.keys(this.posValues)) {
            for (let colKey of Object.keys(this.posValues[rowKey])) {
                let values = this.posValues[rowKey][colKey];
                if (values.length === 1) {
                    foundSingleElement = true;

                    this.assignValue(rowKey, colKey, values[0]);

                }
            }
        }
        this.calculatePossibleValues();
        console.log("pos values after assigning", this.posValues);
        return foundSingleElement;

    }

    degreeHeuristics() {

        //need to add: if they are equal- add to watch list, assign randomly 
        //then can check if any of watched list no longer have any values, then go back to where conflict was

        let numMinOptions = Infinity;
        let maxDegree = -1;
        let bestCell = null;

        console.log("in degree heurisitics this.empty:", this.empty);
        console.log("this.posvalues of empty cells:", this.posValues);
        //loop through empty cells and find cell with least num of possible values 

        for (let [rowKey, rowVal] of Object.entries(this.empty)) {
            for (let [colKey, colVal] of Object.entries(this.empty[rowKey])) {
                const validOptions = this.posValues[rowKey][colVal];

                if (validOptions.length < numMinOptions) {
                    numMinOptions = validOptions.length;
                    maxDegree = this.countConstraints(Number(rowKey), Number(colVal));
                    bestCell = [rowKey, colVal];
                }

            }
        }

        console.log("num of possible values in degree heuristics", this.posValues);

        for (let [rowKey, rowVal] of Object.entries(this.empty)) {
            for (let [colKey, colVal] of Object.entries(this.empty[rowKey])) {
                // console.log("rowkey", rowKey, "rval", rowVal, "colkey", colKey, "colval", colVal);

                console.log("r and c", rowKey, "c", colVal, "this.posvalues[r][c]", this.posValues[rowKey][colVal]);

                const validOptions = this.posValues[rowKey][colVal];


                if (validOptions.length === numMinOptions) {

                    if (!this.watchedLiterals[rowKey]) {
                        this.watchedLiterals[rowKey] = [];
                    }
                    if (!this.watchedLiterals[rowKey].includes(colVal)) {
                        this.watchedLiterals[rowKey].push(colVal);

                    }

                    const degree = this.countConstraints(Number(rowKey), Number(colVal));
                    if (degree > maxDegree) {
                        maxDegree = degree;
                        bestCell = [rowKey, colVal];

                    }

                }

            }
        }
        const[r, c] = bestCell;
   

        this.assignValue(r, c, this.posValues[r][c][0]);

        console.log("watched after delete", this.watchedLiterals);

        console.log("best cell", bestCell);
    }

    /**update all unassigned (empty) cells in the grid */
    getUnassignedCells() {
        console.log("in get unassigned cells");

        for (let r = 0; r < this.row.length; r++) {
            for (let c = 0; c < this.col.length; c++) {
                if (this.board[r][c] === 0) {
                    if (r in this.empty) {
                        if (!this.empty[r].includes(c)) {
                            this.empty[r].push(c);

                        }
                    } else {
                        this.empty[r] = [c];
                    }

                }
            }
        }
        console.log("empty in unassigned cells", this.empty);

    }

    /**Return the number of possible values for the given cell 
     * { 
     * 1: 
     *  {
     *      1:[2, 3], 
     *      3: [4,9]
     *  },
     *  2: {...}...}
    */
    calculatePossibleValues(r, c) {
        
        console.log("in num possible values");

        for (let rowKey in this.empty) {
            this.posValues[rowKey] = {};

            this.empty[rowKey].forEach(col => {
                this.posValues[rowKey][col] = [];
            });

        }

        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // let conflictDetected = false;

        for (let rowKey of Object.keys(this.posValues)) {
            for (let colKey of Object.keys(this.posValues[rowKey])) {

                // console.log("row key", rowKey, "colkey", colKey);
                let validOptions = options.filter(val => this.isValidAssignment(Number(rowKey), Number(colKey), val));
                console.log("valid options", validOptions);
                if (validOptions.length > 0) {
                    this.posValues[rowKey][colKey] = validOptions;
                } else {
                    // conflictDetected = true;
                    this.conflictHistory.push({ row: Number(rowKey), col: Number(colKey), cause: 'No valid options' });
                }



                if (this.posValues[rowKey][colKey].length === 2) {
                    if (!this.watchedLiterals[rowKey]) {
                        this.watchedLiterals[rowKey] = [];
                    }
                    if (!this.watchedLiterals[rowKey].includes(Number(colKey))) {
                        this.watchedLiterals[rowKey].push(Number(colKey));

                    }

                }

            }
        }
        console.log("pos ", this.posValues);
        // return conflictDetected;

        //in num of possible values i should have watched literals


    }


    /** Check if assigning the value to the cell violates Sudoku rules */
    isValidAssignment(r, c, val) {
        return (
            !this.isInRow(r, val) &&
            !this.isInCol(c, val) &&
            !this.isInSubgrid(r, c, val)

        );


    }

    /**returns true or false if value is already in row */
    isInRow(r, val) {
        // console.log("is in row", this.row[r], "val", val);
        console.log(this.row[r].includes(val));

        return this.row[r].includes(val);

    }

    /**returns true or false if value is already in col */
    isInCol(c, val) {
        // console.log("isin col ", this.col[c].includes(val), "c", c, "col", this.col[c]);

        return this.col[c].includes(val);

    }

    /**returns true or false if value is already in subgrid */
    isInSubgrid(r, c, val) {
        const subgridIndex = this.getSubgridIndex(r, c);
        // console.log("is in subgird", this.subgrid[subgridIndex].includes(val), "index is", subgridIndex, "sub", this.subgrid[subgridIndex]);

        return this.subgrid[subgridIndex].includes(val);
    }

    /**returns number of constraints involving a cell 
     * iterates over all columns in the given cell's row.
     *  If a cell in the same row is unassigned and not the given cell itself, 
     * it counts as a constraint.
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

        console.log("constrainst", constraints);
        return constraints;



    }

    /** Assign the value to the cell */
    assignValue(r, c, val) {

        console.log("in assign value where r is:", r, "c:", c, "and val:", val);
        if (!this.isValidAssignment(r, c, val)) {
            // Add conflict information to conflictHistory
            this.conflictHistory.push({ row: r, col: c, value: val });
        }

        this.board[r][c] = val;
        this.row[r][c] = val;
        this.col[c][r] = val;
        this.assignedCells.push({row: Number(r), col: Number(c), value:val} );


        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);
        this.subgrid[subgridIndex][positionInSubgrid] = val;

        delete this.posValues[r][c];

        let start = this.empty[r].indexOf(Number(c));
        this.empty[r].splice(start, 1);

        if (Object.keys(this.posValues[r]).length === 0) {
            delete this.posValues[r];
            delete this.empty[r];
        }

    }

    /**checks for conflict in possible values */
    posValuesHasConflict(){
        

    }






    hasConflict() {
        console.log("in has conflict");
        //didnt delete from watched after assigning best cell- need to delete from watched

        for (let rowKey of Object.keys(this.watchedLiterals)) {
            for (let colVal of this.watchedLiterals[rowKey]) {
                // console.log("this.posvalues[rowkey", this.posValues[rowKey], "at rowkey colval", this.posValues[rowKey][colVal]);


                if ((this.posValues?.[rowKey]?.[colVal]?.length ?? -1) === 0) {
                    console.log('returns');
                    return true; // Conflict detected
                }
            }
        }
        // console.log("it doesnt tho");
        return false;
        //loop through watched literals and get pos values, if pos values is empty, return true

    }
    // Check for any conflicts in the grid

    analyzeConflict() {
        console.log("in analyze conflict");
        const lastAssignedCell = this.assignedCells.pop();
        console.log("the last conflict was", lastAssignedCell);
        return lastAssignedCell;
        // const { row, col, value } = lastConflict;
        // if (!this.isValidAssignment(row, col, value)) {
        //     console.log("it is not a valid assignment so unassign");
        // this.unassignValue(row, col, value);

        //handle value elimination means that now that it knows that that caused a conflict then it can remove that value from the
        //numofPos by calling unassign value



    }
    // Analyze the conflict and learn a new constraint

    backTrack(lastAssignedCell) {
        const { row, col, value } = lastAssignedCell;
        console.log("the last assigned cell is", lastAssignedCell);
        this.unassignValue(row, col, value);



    }
    // Backtrack to a previous state, applying the learned constraint


    // getLastValueBasedConflict() {
    //     for (let i = this.conflictHistory.length - 1; i >= 0; i--) {
    //         const conflict = this.conflictHistory[i];
    //         if (conflict.value !== undefined) {
    //             return conflict;
    //         }
    //     }
    //     return null;
    // }



    /**Remove the value from the cell, reverting it to unassigned */
    unassignValue(r, c, val) {
        //THIS IS WHERE WE GET FUCKED UP!!!!! NEED TO FIGURE OUT HOW TO PUT BACK 

        console.log("in unassign value");
        console.log(this.posValues);
        this.board[r][c] = 0;
        this.row[r][c] = 0;
        this.col[c][r] = 0;
        console.log(this.board);
        console.log(this.row[r]);
        console.log(this.col[c]);

        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);
        // console.log("pos in subgrid", positionInSubgrid);
        // console.log("news", this.subgrid[subgridIndex]);


        this.subgrid[subgridIndex][positionInSubgrid] = 0;
        this.assignedCells.pop();
    

        //resestting num of possible values
        if (!this.empty[r]) {
            this.empty[r] = [];
        }
        console.log(this.empty[r]);
        this.empty[r].push(Number(c));
        console.log("empty",this.empty);
        this.calculatePossibleValues();
        console.log("innnn unassign value num of posvalues after:", this.posValues);
        let start = this.posValues[r][c].indexOf(val);
        console.log(start);
        this.posValues[r][c].slice(start, 1);
        console.log("in unassign value num of posvalues after:", this.posValues);





    }

    /** Check if the Sudoku is completely and correctly filled */
    isSudokuSolved() {
        for (let r = 0; r < this.row.length; r++) {
            for (let c = 0; c < this.col.length; c++) {
                if (this.board[r][c] === 0) {
                    return false;
                }
            }
        }
        return true;

    }





}

module.exports = { Sudoku };

```



