import "./SudokuCell.css";
/** Component for SudokuCell
 *  Renders a cell for sudoku grid
 * 
 * Props: 
 *  - value: the value to be displayed in cell (number or empty)
 *  - isHighlighted: Iindicates whether cell should be highlighted (e.g. for conflicts, assignments
 *      backtracking, etc)
 * 
 * State: none
 *  
 * links to: none
 * 
 * SudokuBoard -> SudokuCell
 */

function SudokuCell({value, isHighlighted}){
    // console.log("in sudoku cell value", value);
    return (
        <div className={`sudoku-cell ${isHighlighted ? 'highlighted' : ''}`} >
            {value || ''}
        </div>
    );
};

export default SudokuCell;