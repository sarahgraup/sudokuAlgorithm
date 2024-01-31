const fsP = require('fs/promises');
const { Sudoku } = require('./sudoku'); 

jest.mock('fs/promises'); // Mock fs/promises for testing file operations

describe('Sudoku Solver Tests', () => {

    beforeEach(() => {
        // Setup before each test, like resetting mocks if needed
    });

    test('Sudoku.getSudoku loads board correctly from file', async () => {
        const mockData = '5 3 0 0 7 0 0 0 0\n6 0 0 1 9 5 0 0 0\n...'; // Add the rest of your board data
        fsP.readFile.mockResolvedValue(mockData);

        const board = await Sudoku.getSudoku('sudokus/s17.txt');
        // Now you would want to test if 'board' is correctly initialized
        // For example:
        expect(board).toBeInstanceOf(Sudoku);
        // Further assertions...
    });

    test('Sudoku board is correctly initialized', () => {
        const initialBoard = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            // ... rest of the board
        ];
        const sudoku = new Sudoku(initialBoard);
        sudoku.createBoard();
        // Assertions to check if the board is initialized correctly
        // For example:
        expect(sudoku.board).toEqual(initialBoard);
        // Further assertions...
    });

    test('Sudoku solver finds a solution', () => {
        const initialBoard = [
            // ... initial unsolved board
        ];
        const solvedBoard = [
            // ... expected solved board
        ];
        const sudoku = new Sudoku(initialBoard);
        sudoku.createBoard();
        sudoku.cdclSolver();
        // Check if the solution is correct
        expect(sudoku.board).toEqual(solvedBoard);
    });

    // Add more tests as needed
});

