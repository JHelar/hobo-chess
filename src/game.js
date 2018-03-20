const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 640;
const CELL_WIDTH = CANVAS_WIDTH / 3;
const CELL_HEIGHT = CANVAS_HEIGHT / 3;
const BOARD_SIZE = 3;
const FONT_SIZE = 16 * 5;

let BOARD = [];
let CURRENT_PLAYER = 'X';
let NEED_REDRAW = true;

const newRow = rowIndex => {
    const row = [];
    for(let cell = 0; cell < BOARD_SIZE; cell++){
        row.push(createCell(rowIndex, cell));
    }    
    return row;
}
const createCell = (rowIndex, columnIndex) => ({ value: '', color: '#fff', textColor: '#000', x: rowIndex * CELL_WIDTH, y: columnIndex * CELL_HEIGHT });

const newBoard = () => {
    const board = [];
    for(let row = 0; row < BOARD_SIZE; row++){
        board.push(newRow(row));
    }
    return board;
}
/*Game logic*/
const getClosestSquare = (mouseX, mouseY) => {
    return {
        x: (mouseX / CELL_WIDTH) | 0,
        y: (mouseY / CELL_HEIGHT) | 0
    }
}

const checkGameState = board => {
    const getColumns = board => board.map(row => row);
}

export function mousePressed(){
    const { x, y } = getClosestSquare(mouseX, mouseY);
    const cell = BOARD[x][y];
    cell.value = CURRENT_PLAYER;
    CURRENT_PLAYER = CURRENT_PLAYER === 'X' ? 'O' : 'X';

    NEED_REDRAW = true;
    return false;
}

export function setup(){
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    BOARD = newBoard();
}

export function draw(){
    if(NEED_REDRAW){
        // Draw board
        BOARD.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                textSize(FONT_SIZE);
                textAlign(CENTER, CENTER);

                fill(cell.color)
                rect(cell.x, cell.y, CELL_WIDTH, CELL_HEIGHT);
                fill(cell.textColor)
                text(cell.value, cell.x + (CELL_WIDTH / 2), cell.y + (CELL_HEIGHT / 2));
            })
        })
        NEED_REDRAW = false;
    }
}