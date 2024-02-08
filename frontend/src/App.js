import { useRef, useState, useEffect } from "react";
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
  const previousBoardRef = useRef([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [solverStatus, setSolverStatus] = useState('stopped');
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [solverSteps, setSolverSteps] = useState([]);

  const [selectedPuzzle, setSelectedPuzzle] = useState({ difficulty: '', filename: '' });
  const [puzzles, setPuzzles] = useState({ easy: [], medium: [], hard: [] });


  const loadPuzzle = async (difficulty, puzzleId) => {
    try {
      const res = await SudokuApi.initializeBoard(difficulty, puzzleId);

      setBoard(res.board);
      setSelectedPuzzle({ difficulty, filename: puzzleId });
      setSolverStatus('stopped');
      setCurrentStep(null);
    } catch (err) {
      console.error("failed to load puzzle", err);
    }
  };


  /**gets puzzle txt file based on file name and solves */
  const fetchAndSetSolverSteps = async (selectedPuzzle) => {
    try {
      setSolverStatus('running');
      const { difficulty, filename } = selectedPuzzle;
      const res = await SudokuApi.getActions(difficulty, filename);
      setSolverSteps(res.steps || []);
      setCurrentStep(0);

    } catch (err) {
      console.error("failed to solve puzzle", err);
      setSolverStatus('stopped');
    }
  }

  /**updates board and current step */
  const updateBoardAndStep = (newStep) => {
    // setPreviousBoard(board);
    // console.log("previous board",previousBoard);
    console.log("current step",currentStep, "new step", newStep);
    const currentSolverStep = solverSteps[newStep];
    console.log("currentSolverStep", currentSolverStep);
    const { row, col, boardState} = currentSolverStep;

    if(boardState){
      setBoard(boardState.map(row => [...row]));
    }
   
 
    setCurrentStep(newStep);
    setHighlightedCell({row, col});
    
  };



  /**
   * updates board and currentstep on 1 second interval
   * after change of currentstep, solversteps, or solverstatus
   * */
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        solverSteps.length > 0 &&
        currentStep !== null &&
        (solverStatus === "running" || solverStatus === "resumed")
      ) {
        if (currentStep < solverSteps.length - 1) {
          console.log("new board", board);
          updateBoardAndStep(currentStep + 1);
        } else {
          clearInterval(timer);
          setSolverStatus('stopped');
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  
  }, [currentStep, solverSteps, solverStatus]);

  /**solves puzzle or sets solver status to paused based on user action */
  const controlSolver = async (action) => {
    if (action === 'start') {
      console.log("selected puzzle", selectedPuzzle);
      await fetchAndSetSolverSteps(selectedPuzzle);
      if(solverSteps.length>0){
        updateBoardAndStep(0);
      }
    } else if (action === 'pause') {
      setSolverStatus('paused');
    } else if (action === 'resume') {
      setSolverStatus('resumed');
    }
  };

  /**sets step index on user click */
  const handleStepChange = (direction) => {
    if (direction === 'forward' && currentStep < solverSteps.length - 1) {
      setSolverStatus('paused');
      updateBoardAndStep(currentStep + 1);
    } else if (direction === 'backward' && currentStep > 0) {
      setSolverStatus('paused');
      updateBoardAndStep(currentStep - 1);
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
        onResume={() => controlSolver('resume')}
        onStepForward={() => handleStepChange('forward')}
        onStepBackward={() => handleStepChange('backward')}
      />
      <SudokuBoard board={board} highlightedCell = {highlightedCell} />
      <DifficultySelector onSelectPuzzle={handleSelectPuzzle} puzzles={puzzles} />

      {/* <SolverStepsAnimation steps={solverSteps} currentStepIndex={currentStep} /> */}
    </div>
  );
}

export default App;

