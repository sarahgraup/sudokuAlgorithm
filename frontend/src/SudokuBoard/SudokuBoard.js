import "./SudokuBoard.css";
import SudokuCell from "./SudokuCell";
/** Component for SudokuBoard
 *  Renders a sudoku board 
 * 
 * Props:
 * - board: Current board state (2D array from App's state)
 * - highlightedCell: the current cell to be highlighted
 * 
 * State: None 
 * 
 * App -> SudokuBoard
 */

function SudokuBoard({ board, highlightedCell }) {
   
    return (
        <div className="SudokuBoard">

            {board.map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                    <SudokuCell
                        key={`${rowIndex}-${cellIndex}`}
                        value={cell}
                        isHighlighted={highlightedCell &&
                            highlightedCell.row === rowIndex &&
                            highlightedCell.col === cellIndex}
                        highlightColor={highlightedCell?.actionType === 'conflict' ? 'red' :
                            highlightedCell?.actionType === 'unassign' ? 'green' : 
                            highlightedCell?.actionType === 'assign' ? 'yellow' : ''}
                    />
                ))
            )}

        </div>
    );
}

export default SudokuBoard;