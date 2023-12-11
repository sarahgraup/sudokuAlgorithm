"use strict";
const fsP = require('fs/promises');


class Sudoku{
    constructor(board){
        this.empty = 0;
        this.row = [];
        this.col = [];
        this.subgrid = [];
        this.board = board;

    }

    static async getSudoku(file){

        let contents;
        try {
           contents = await fsP.readFile(`${file}`, "utf8");
         
        } catch (err) {
          process.exit(1);
        }
    
        const board = contents.split('\r\n').map(r => r.trim()).map(c => c.split(' ').map(Number));
       
        return new Sudoku(board);
    }

    createBoard(){

        const boardSize = 9;
        const subgridSize = 3;

        for(let i=0; i<boardSize; i++){
            this.subgrid.push([]);
        }

        for(let r = 0; r<boardSize; r++){
            this.row.push(this.board[r]);
            this.col.push([]);
           
            for(let c=0; c<boardSize; c++){
                this.col[r].push(this.board[c][r]);
                const subgridRow = Math.floor(r / subgridSize);
                const subgridCol = Math.floor(c / subgridSize);
                const subgridIndex = subgridRow * subgridSize + subgridCol;
           
                this.subgrid[subgridIndex].push(this.board[r][c]);
         

            }
         
        }
    
        console.log(this.subgrid);
        
    }

    /**main function that calls helper functions to solve sudoku 
     * The main recursive function for solving the Sudoku. It stops if the Sudoku is solved, 
     * otherwise it selects an unassigned cell and tries possible values for that cell.
    */
    cdclSolver(){

    }

    propagateConstraints(){

    }
    // Propagate Sudoku constraints across rows, columns, and boxes
    
    hasConflict(){

    }
    // Check for any conflicts in the grid

    analyzeConflict(){

    }
    // Analyze the conflict and learn a new constraint
    
    backTrack(){

    }
    // Backtrack to a previous state, applying the learned constraint

    /**chooses a cell to assign value based on heurisitics 
     * This function implements the MRV and Degree heuristics.
     *  It selects the cell with the fewest possible values (MRV). 
     * If there's a tie, it then uses the Degree heuristic to select the cell 
     * with the most constraints with other unassigned cells.
    */
    selectUnassignedCell(){

    }

    /**Return a list of all unassigned (empty) cells in the grid */
    getUnassignedCells(){

    }

    /**Return the number of possible values for the given cell */
    countPossibleValues(){

    }

    /**returns number of constraints involving a cell 
     * iterates over all columns in the given cell's row.
     *  If a cell in the same row is unassigned and not the given cell itself, 
     * it counts as a constraint.
    */
    countConstraints(){

    }

19 345
 
    /**Return the row and column indices of the cell */
    getRowAndColumn(){

    }
    

    /**Return the starting row and column indices of the 3x3 box that contains the cell */
    getStartOfBox(){

    }
    

    /** Check if assigning the value to the cell violates Sudoku rules */
    isValidAssignment(){

    }
   
    /** Assign the value to the cell */
    assignValue(){

    }
    
    /**Remove the value from the cell, reverting it to unassigned */
    unassignValue(){

    }

    /** Check if the Sudoku is completely and correctly filled */
    isSudokuSolved(){

    }





}

module.exports={Sudoku};