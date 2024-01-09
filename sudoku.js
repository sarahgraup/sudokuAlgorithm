"use strict";
const fsP = require('fs/promises');


//subgrid fucks it up 


class Sudoku {
    constructor(board) {
        this.empty = {};
        this.row = [];
        this.col = [];
        this.subgrid = [];
        this.board = board;
        this.boardSize = 9;
        this.subgridSize = 3;
        this.posValues = {};

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


        let cell = this.selectUnassignedCell();


    }



    /**chooses a cell to assign value based on heurisitics 
     * This function implements the MRV and Degree heuristics.
     *  It selects the cell with the fewest possible values (MRV). 
     * If there's a tie, it then uses the Degree heuristic to select the cell 
     * with the most constraints with other unassigned cells.
    */
    selectUnassignedCell() {

        let foundSingleElement = false;

        this.getUnassignedCells();
        console.log("first ple", this.empty);

        //checks if all unassigned cells have more than 1 possible value



        this.numPossibleValues();

   

        for(let rowKey of Object.keys(this.posValues)){
            for(let colKey of Object.keys(this.posValues[rowKey])){
                let values = this.posValues[rowKey][colKey];
                if(values.length===1){
                    foundSingleElement = true;
       
                    this.assignValue(rowKey, colKey, values[0]);

                }
            }
        }



        if(foundSingleElement===false){
            return;
        }else{
            this.selectUnassignedCell();
        }

        
       
        // if(unassignedCells.every(cell=> cell.length > 1)){
        //     console.log("all unassigned cells have more than one pos val");
        //     return;
        // }



        // let numMinOptions = Infinity;
        // let maxDegree = -1;
        // let bestCell = null;

        // let onlyOneOption = true;

        // while(onlyOneOption){



        //     for(let r=0; r<this.empty.length; r++){
        //         for(let c=0; c<this.empty[r].length; c++){
        //             const validOptions = this.numPossibleValues(r, c);
        //             if(validOptions.length===1){
        //                 onlyOneOption = true;
        //                 console.log("r", r, "c", c, "only one option", validOptions);
        //                 this.assignValue(r, c, validOptions[0]);
        //                 break;
        //             }else{
        //                 onlyOneOption = false;
        //             }



        //         }
        //         if(onlyOneOption===true){
        //             r--;
        //         }
        //     }
        //     this.getUnassignedCells();
        // }
        // onlyOneOption = false;
        // this.getUnassignedCells();
        // this.empty.forEach(([r,c]) => {

        //     const validOptions = this.numPossibleValues(r, c);
        //     if(validOptions.length===1){
        //         onlyOneOption = true;
        //         this.assignValue(r, c, validOptions[0]);
        //         console.log(this.board);
        //     }

        // });

        // console.log("NEXT ONEEEEEEEEEEEEEEEEEEE");


        //change it so first it just checks if one value and then assign. then alters board, and does again
        // this.empty.forEach(([r,c]) => {
        //     const validOptions = this.numPossibleValues(r, c);
        //     if(validOptions.length===1){
        //         this.assignValue(r, c, validOptions[0]);
        //     }

        // });
        // this.getUnassignedCells();
        // this.empty.forEach(([r,c]) => {
        //     const validOptions = this.numPossibleValues(r, c);
        //         if(validOptions.length < numMinOptions){
        //             numMinOptions = validOptions.length;
        //             maxDegree = this.countConstraints(r, c);
        //             bestCell = [r,c];
        //         }
        //         else if(validOptions.length===numMinOptions){
        //             const degree = this.countConstraints(r, c);
        //             if(degree > maxDegree){
        //                 maxDegree = degree;
        //                 bestCell = [r,c];
        //             }


        //         }

        //     });



        // console.log("best cell", bestCell);

        // return bestCell;




    }

    /**return all unassigned (empty) cells in the grid */
    getUnassignedCells() {


        for (let r = 0; r < this.row.length; r++) {
            for (let c = 0; c < this.col.length; c++) {
                if (this.board[r][c] === 0) {
                    if (r in this.empty) {
                        if(!this.empty[r].includes(c)){
                            this.empty[r].push(c);

                        }

                        

                    } else {
                        this.empty[r] = [c];
                    }

                }


            }
        }


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
    numPossibleValues(r, c) {
       
        for (let rowKey in this.empty) {
            this.posValues[rowKey] = {};

            this.empty[rowKey].forEach(col => {
                this.posValues[rowKey][col] = [];
            });

        }

     

        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let rowKey of Object.keys(this.posValues)) {
            for (let colKey of Object.keys(this.posValues[rowKey])) {
                for (let i = 0; i < options.length; i++) {
                    if (this.isValidAssignment(rowKey, colKey, options[i])) {
                        this.posValues[rowKey][colKey].push(options[i]);
                    }
                }
            }
        }


    }


    /** Check if assigning the value to the cell violates Sudoku rules */
    isValidAssignment(r, c, val) {
        return (
            !this.isInRow(r, val) &&
            !this.isInCol(r, c, val) &&
            !this.isInSubgrid(r, c, val)

        );


    }

    /**returns true or false if value is already in row */
    isInRow(r, val) {

        return this.row[r].includes(val);

    }

    /**returns true or false if value is already in col */
    isInCol(r, c, val) {
   
        return this.col[c].includes(val);

    }

    /**returns true or false if value is already in subgrid */
    isInSubgrid(r, c, val) {
        const subgridIndex = this.getSubgridIndex(r, c);

        return this.subgrid[subgridIndex].includes(val);
    }

    /**returns number of constraints involving a cell 
     * iterates over all columns in the given cell's row.
     *  If a cell in the same row is unassigned and not the given cell itself, 
     * it counts as a constraint.
    */
    countConstraints(r, c) {
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

        this.subgrid[subgridIndex].forEach((val, index) => {
            if (val === 0) {
                constraints++;
            }

        });
        constraints -= 1;
        console.log("constrainst", constraints);
        return constraints;



    }

    /** Assign the value to the cell */
    assignValue(r, c, val) {

        // console.log("board before", this.board);

      

        this.board[r][c] = val;
        // console.log("board after", this.board);

   
        this.row[r][c] = val;
        this.col[c][r] = val;
   



     


        const subgridIndex = this.getSubgridIndex(r, c);
        const positionInSubgrid = (r % this.subgridSize) * this.subgridSize + (c % this.subgridSize);
        // console.log("pos in subgrid", positionInSubgrid);
        // console.log("news", this.subgrid[subgridIndex]);
     
      

        this.subgrid[subgridIndex][positionInSubgrid] = val;
        // console.log(this.subgrid[subgridIndex]);
        // console.log("the position", positionInSubgrid);
        // console.log(this.subgrid[subgridIndex][positionInSubgrid]);





        // console.log("the subgrid after", this.subgrid[subgridIndex]);

        console.log("pos vals",this.posValues)



       
        delete this.posValues[r][c];
        console.log("vals after", this.posValues);



        let start = this.empty[r].indexOf(Number(c));
        this.empty[r].splice(start,1);
        console.log("empty", this.empty);


        if(Object.keys(this.posValues[r]).length===0){
            delete this.posValues[r];
            delete this.empty[r];
        }


        console.log("vals after", this.posValues);

       console.log("empty", this.empty);

  


           
            
        // }
       
        console.log("all board", this.board);


        


        

        
        // this.empty.splice(foundIndex, 1);

      

        // const subgridIndex = this.getSubgridIndex(r, c);
        // this.subgrid[subgridIndex][r,c] = val;


    }


    propagateConstraints() {

    }




    /**Return the row and column indices of the cell */
    getRowAndColumn() {

    }


    /**Return the starting row and column indices of the 3x3 box that contains the cell */
    getStartOfBox() {

    }



    hasConflict() {

    }
    // Check for any conflicts in the grid

    analyzeConflict() {

    }
    // Analyze the conflict and learn a new constraint

    backTrack() {

    }
    // Backtrack to a previous state, applying the learned constraint






    /**Remove the value from the cell, reverting it to unassigned */
    unassignValue() {

    }

    /** Check if the Sudoku is completely and correctly filled */
    isSudokuSolved() {
        for (let r = 0; r < this.row.length; r++) {
            for (let c = 0; c < this.col.length; c++) {
                if (this.board[r][c] === null) {
                    return false;
                }
            }
        }
        return true;

    }





}

module.exports = { Sudoku };