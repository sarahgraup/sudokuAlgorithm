import { useState, useEffect } from "react";
import SudokuBoard from './SudokuBoard/SudokuBoard';
import ControlPanel from './Controls/ControlPanel'
import DifficultySelector from './Controls/DifficultySelector';
// import SolverStepsAnimation from './SolverStepsAnimation';
import SudokuApi from "./Api/SudokuApi";
import './App.css';

/**App
 * 
 * State:
 *  - current Sudoky board (2d array)
 *  - Solver status: indicates if solver is  (running, paused, stopped).
    - Current step: current step for stepping through the solution.
    - solverSteps: array of steps solver takes including assignments, conflicts and backtracking
    - Selected difficulty and puzzle list.

  Props: none

   App -> sudokuSolver
 * 
 */
function App() {

  const [board, setBoard] = useState([]);
  const [solverStatus, setSolverStatus] = useState('stopped');
  const [currentStep, setCurrentStep] = useState(0);
  const [solverSteps, setSolverSteps] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState({difficulty: '', filename: ''});
  const [puzzles, setPuzzles] = useState({ easy: [], medium: [], hard: [] });

  const loadPuzzle = async (difficulty, puzzleId) => {
    try {
      const res = await SudokuApi.initializeBoard(difficulty, puzzleId);

      setBoard(res.board);
      setSelectedPuzzle({ difficulty, filename: puzzleId });
      setSolverStatus('stopped');
      setCurrentStep(0);
      // setSolverSteps[];

    } catch (err) {
      console.error("failed to load puzzle", err);

    }
  };

  /**gets puzzle txt file based on file name and solves */
  const fetchAndSolvePuzzle = async (selectedPuzzle) => {
    try {
      setSolverStatus('running');
      const {difficulty, filename} = selectedPuzzle;
      const res = await SudokuApi.getActions(difficulty, filename);
      setSolverSteps(res.steps);
      // Here you can automatically start animating the steps or wait for user interaction

    } catch (err) {
      console.error("failed to solve puzzle", err);
      setSolverStatus('stopped');
    }
  }

  /**solves puzzle or sets solver status to paused based on user action */
  const controlSolver = (action) => {
    if (action === 'start') {
      console.log("selected puzzle", selectedPuzzle);
      fetchAndSolvePuzzle(selectedPuzzle);
    } else if (action === 'pause') {
      setSolverStatus('paused');
    }
  };

  /**sets step index on user click */
  const handleStepChange = (direction) => {
    if (direction === 'forward' && currentStep < solverSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'backward' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**fetches puzzle name on mount */
  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const resp = await SudokuApi.getPuzzles('/puzzles');
        // const data = await resp.json();
        console.log("response puzzles", resp);
        setPuzzles(resp.puzzles);

        //automatically load first puzzle up 
        if (resp.puzzles && Object.keys(resp.puzzles).length > 0) {
          const firstDifficulty = Object.keys(resp.puzzles)[0];
          const firstPuzzle = resp.puzzles[firstDifficulty][0];
          console.log(firstDifficulty, firstPuzzle);
          loadPuzzle(firstDifficulty, firstPuzzle);
        }
      } catch (err) {
        console.error('failed to feth puzzles', err);
      }
    };
    fetchPuzzles();
  }, []);

  /**fetches puzzle data on user click */
  const handleSelectPuzzle = (difficulty, puzzleId) => {
    loadPuzzle(difficulty, puzzleId);
  }




  return (
    <div className="App">
       <ControlPanel
        onStart={() => controlSolver('start')}
        onPause={() => controlSolver('pause')}
        onStepForward={() => handleStepChange('forward')}
        onStepBackward={() => handleStepChange('backward')}
      />
      <SudokuBoard board={board} />
      <DifficultySelector onSelectPuzzle={handleSelectPuzzle} puzzles={puzzles} />
     
      {/* <SolverStepsAnimation steps={solverSteps} currentStepIndex={currentStep} /> */}
    </div>
  );
}

export default App;

