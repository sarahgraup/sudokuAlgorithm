import "./SolverStepsAnimation.css";

/**Solver Steps Animation
 * 
 * Describes each step of sudoku solving process including assignments, 
 * conflicts, and backtracking
 * 
 * Props:
 *  - currentStep:the current step to describe.
 *  - solverSteps: array of steps solver takes including assignments, conflicts and backtracking
 * 
 * State: none
 * 
   App -> sudokuSolver
 * 
 */

function SolverStepsAnimation({ currentStep, solverSteps }) {
  if (!currentStep || !solverSteps) return null;

  const step = solverSteps[currentStep];
  console.log("in solver steps the step is:", solverSteps[currentStep]);
  let actionText = "";

  if (step.actionType === 'conflict') {
    actionText = `Oh no, there is a conflict at Row: ${step.row + 1}, Col: ${step.col + 1}, Value: ${step.value}. We must backtrack.`;
  } else if (step.actionType === 'assign' || step.actionType === 'unassign') {
    actionText = `${step.actionType.charAt(0).toUpperCase() + step.actionType.slice(1)} at Row: ${step.row + 1}, Col: ${step.col + 1}, Value: ${step.value}.`;
  } else {
    // Handle other actions or default message
    actionText = `Performing ${step.action} at Row: ${step.row + 1}, Col: ${step.col + 1}.`;
  }

  return (
    <div className="solver-steps-animation">
      {actionText}
    </div>
  );


}

export default SolverStepsAnimation;
