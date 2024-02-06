import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 */

class SudokuApi {

    static async request(endpoint, data = {}, method = "get") {
        // console.debug("API Call:", endpoint, data, method);
        // console.log("API token: ", this.token);

        const url = `${BASE_URL}/${endpoint}`;
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params })).data;
        } catch (err) {
            // console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /**
     * 
     * @param {string} difficulty - string of folder of txt file
     * @param {string} puzzleId - txt file name
     * @returns initial board state { board: [[]] }
     */
    static async initializeBoard(difficulty, puzzleId) {
        const res = await this.request(`puzzles/${difficulty}/${puzzleId}`);

        return res;


    }

    /**
     * 
     * @param {string} selectedPuzzle - string txt file of selected sudoku puzzle
     * @returns every action taken to solve sudoku board
     *      [steps: {actiontype:..., {row, col, val, boardstate} }, {...}, ...]
     */
    static async getActions(difficulty, filename){
        const res = await this.request(`solve/${difficulty}/${filename}`);
        console.log("puzzles res",res);
        return res;
    }

    /**
     * @returns obj of puzzle files
     *       { easy:[ filename1, 2, ...], medium:[...], hard:[...] }
     */
    static async getPuzzles(){
        const res = await this.request('puzzles');
        console.log("puzzles res",res);
        return res;

    }

}

export default SudokuApi;