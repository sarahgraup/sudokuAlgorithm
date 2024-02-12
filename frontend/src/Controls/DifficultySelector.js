import React, { useState, useEffect } from 'react';
import "./DifficultySelector.css";
/** Component for Difficulty Selector
 *  Renders selection of difficulty levels and specified puzzles
 * 
 * Props:
 * - onSelectPuzzle: function to update selected puzzle in apps state
 *      and load puzzle
 * - puzzle: object of puzzles
 * 
 * State: None 
 * 
 * Function: 
 *  - handlers to managbe dropdown selections
 *  - onSelectPuzzle: load selected puzzle into app component based on change of user click
 *  
 * links to: none
 * 
 * App -> DifficultySelector
 */
function DifficultySelector({ onSelectPuzzle, puzzles }) {

    const [visibleDropDown, setVisibleDropdown] = useState(null);

    /**handler for changing visible dropdown */
    const handleDifficultyClick = (difficulty) => {
        setVisibleDropdown(difficulty === visibleDropDown ? '' : difficulty);
    }

    return (
        <div className='difficulty-selector'>
            {['easy', 'medium', 'hard'].map((difficulty) => {
                return (<div key={difficulty}>
                    <button onClick={() => handleDifficultyClick(difficulty)}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                    {visibleDropDown === difficulty && puzzles[difficulty] && (
                        <select onChange={(e) => onSelectPuzzle(difficulty, e.target.value)}>
                            <option value=""></option>
                            {puzzles[difficulty].map((puzzle, index) => (
                                <option key={index} value={puzzle}>{puzzle}</option>
                            ))}
                        </select>
                    )}
                </div>);
            })}
        </div>
    );
}


// import React from 'react';
// import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

// function DifficultySelector({ onSelectPuzzle, puzzles }) {
//   const [difficulty, setDifficulty] = useState('');

//   const handleChange = (evt) => {
//     const { name, value } = evt.target;
//     setDifficulty(value);
//     onSelectPuzzle(name, value);
//   };

//   return (
//     <div className='difficulty-selector'>
//       {['easy', 'medium', 'hard'].map(difficulty => (
//         <FormControl key={difficulty} fullWidth>
//           <InputLabel id={`${difficulty}-label`}>{difficulty}</InputLabel>
//           <Select
//             labelId={`${difficulty}-label`}
//             id={difficulty}
//             value={difficulty === difficulty ? difficulty : ''}
//             onChange={handleChange}
//             name={difficulty}
//           >
//             {puzzles[difficulty].map((puzzle, index) => (
//               <MenuItem key={index} value={puzzle}>{puzzle}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ))}
//     </div>
//   );
// }

export default DifficultySelector;
// import React from 'react';



