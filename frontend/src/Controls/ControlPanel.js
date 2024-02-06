import "./ControlPanel.css";

/** Component for Control Panel
 *  Renders buttons for controlling the solver
 * 
 * Props:
 * - function to control solver (onStart, onStop, onPause, onResume)
 * 
 * State: None 
 * 
 * Function: 
 *  - handlers for button clicks that call provided control functions
 *  
 * links to: none
 * 
 * App -> Control Panel
 */

function ControlPanel({onStart, onPause, onForward, onBackward}){
    return (
        <div className="control-panel">
            <button onClick={onStart}>Start</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onForward}>Forward</button>
            <button onClick={onBackward}>Backward</button>
        </div>
    );

}

export default ControlPanel;