"use strict";
const fsP = require('fs/promises');


class Sudoku{
    constructor(board){
        this.empty = [];
        this.row = [];
        this.col = [];
        this.subgrid = [];
        this.board = board;
        this.boardSize = 9;
        this.subgridSize = 3;

    }

    /**  */
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

    /**initilizes sudoku board with new board */
    createBoard(){

  

        for(let i=0; i<this.boardSize; i++){
            this.subgrid.push([]);
        }

        for(let r = 0; r<this.boardSize; r++){
            this.row.push(this.board[r]);
            this.col.push([]);
           
            for(let c=0; c<this.boardSize; c++){
                this.col[r].push(this.board[c][r]);
                // const subgridRow = Math.floor(r / this.subgridSize);
                // const subgridCol = Math.floor(c / this.subgridSize);
                // const subgridIndex = subgridRow * this.subgridSize + subgridCol;
                const subgridIndex = this.getSubgridIndex(r,c);
           
                this.subgrid[subgridIndex].push(this.board[r][c]);
         

            }
         
        }
    
        // console.log(this.col);
        // console.log("sub", this.subgrid);
        // console.log("board", this.board);
        
    }

    /**returns subgrid index based on row and col */
    getSubgridIndex(r,c){
        const subgridRow = Math.floor(r / this.subgridSize);
        const subgridCol = Math.floor(c / this.subgridSize);
        const subgridIndex = subgridRow * this.subgridSize + subgridCol;

        return subgridIndex;


    }

    /**main function that calls helper functions to solve sudoku 
     * The main recursive function for solving the Sudoku. It stops if the Sudoku is solved, 
     * otherwise it selects an unassigned cell and tries possible values for that cell.
    */
    cdclSolver(){
        if(this.isSudokuSolved()){
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
    selectUnassignedCell(){
        this.getUnassignedCells();
        let numMinOptions = Infinity;
        let maxDegree = -1;
        let bestCell = null;
        //change it so first it just checks if one value and then assign. then alters board, and does again
        this.empty.forEach(([r,c]) => {
            const validOptions = this.numPossibleValues(r, c);
            if(validOptions.length===1){
                this.assignValue(r, c, validOptions[0]);
            }
        // this.empty.forEach(([r,c]) => {
        //     const validOptions = this.numPossibleValues(r, c);
        //     if(validOptions.length>1){
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

        //     }
        //     else{
        //         this.assignValue(r, c, validOptions[0]);

        //     }
            
            // const degree = this.countConstraints(r, c);

            // if(validOptions.length< numMinOptions || (validOptions.length===numMinOptions && degree> maxDegree) ){
            //     numMinOptions = validOptions;
            //     maxDegree = degree;
            //     bestCell = [r,c];
            // }

        });

        // console.log("best cell", bestCell);

        return bestCell;




    }

    /**return all unassigned (empty) cells in the grid */
    getUnassignedCells(){

        for(let r=0; r<this.row.length; r++){
            for(let c=0; c<this.col.length; c++){
                if(this.board[r][c]===0){
                    this.empty.push([r, c]);
                   
                }


            }
        }
       
        return this.empty;
        


    }

    /**Return the number of possible values for the given cell */
    numPossibleValues(r,c){
        const options = [1,2,3,4,5,6,7,8,9];
        const validOptions = [];
        console.log("row", r, "col", c);

        for(let i=0; i<options.length; i++){
            if(this.isValidAssignment(r, c, options[i])){
                validOptions.push(options[i]);
            

            }

        }

        console.log("valid options", validOptions);

        return validOptions;
    }

     /** Check if assigning the value to the cell violates Sudoku rules */
     isValidAssignment(r, c, val){
        return(
            !this.isInRow(r, val) &&
            !this.isInCol(r, c, val) &&
            !this.isInSubgrid(r, c, val)
        
        );


     }

     /**returns true or false if value is already in row */
     isInRow(r, val){
        // console.log(this.row[r]);
        return this.row[r].includes(val);

     }

    /**returns true or false if value is already in col */
     isInCol(r, c, val){
        // console.log("board at rc", this.col[c]);
        return this.col[c].includes(val);

     }

     /**returns true or false if value is already in subgrid */
     isInSubgrid(r, c, val){
        const subgridIndex = this.getSubgridIndex(r, c);

        return this.subgrid[subgridIndex].includes(val);
     }

    /**returns number of constraints involving a cell 
     * iterates over all columns in the given cell's row.
     *  If a cell in the same row is unassigned and not the given cell itself, 
     * it counts as a constraint.
    */
    countConstraints(r, c){
        let constraints = 0;

        this.row[r].forEach((val, index)=>{
            if(val===0 && index!==c){
                constraints++;
            }

        });
        this.col[c].forEach((val, index)=>{
            if(val===0  && index!==r){
                constraints++;
            }
        });

        const subgridIndex = this.getSubgridIndex(r, c);

        this.subgrid[subgridIndex].forEach((val, index)=>{
            if(val===0){
                constraints++;
            }

        });
        constraints-=1;
        console.log("constrainst", constraints);
        return constraints;

        

    }

     /** Assign the value to the cell */
     assignValue(r, c, val){
 
        this.board[r][c] = val;
        

        this.row[c][r] = val;
        this.col[c][r] = val;

        // console.log("board", this.board);
        // console.log("rc", this.col[r]);
        // console.log("row cr", this.row[c][r]);

        // const subgridIndex = this.getSubgridIndex(r, c);
        // this.subgrid[subgridIndex][r,c] = val;


    }


 
    /**Return the row and column indices of the cell */
    getRowAndColumn(){

    }
    

    /**Return the starting row and column indices of the 3x3 box that contains the cell */
    getStartOfBox(){

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
    

   
   
   
    
    /**Remove the value from the cell, reverting it to unassigned */
    unassignValue(){

    }

    /** Check if the Sudoku is completely and correctly filled */
    isSudokuSolved(){
        for(let r=0; r<this.row.length; r++){
            for(let c=0; c<this.col.length; c++){
                if(this.board[r][c]===null){
                    return false;
                }
            }
        }
        return true;

    }





}

module.exports={Sudoku};