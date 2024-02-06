import "./SudokuBoard.css";
import SudokuCell from "./SudokuCell";
/** Component for SudokuBoard
 *  Renders a sudoku board 
 * 
 * Props:
 * - board: Current board state (2D array from App's state)
 * 
 * State: None 
 *  
 * links to: none
 * 
 * SudokuBoard -> SudokuCell
 */

function SudokuBoard({board}) {


    return (
        <div className="SudokuBoard">

           {board.map((row, rowIndex)=>
                row.map((cell, cellIndex)=>(
                    <SudokuCell
                        key={`${rowIndex}-${cellIndex}`}
                        value={cell}
                    />
                ))
           )}

        </div>
    );
}

export default SudokuBoard;