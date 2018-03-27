const Human = require('./Entities/human');
const RandomRobot = require('./Entities/robot-random');
const _ = require('lodash');

const SPACE_BAR = 32;
const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 640;
const TILE_SIZE = CANVAS_WIDTH / 3;
const BOARD_SIZE = 3;
const FONT_SIZE = 16 * 5;
const GAME_STATES = {
    NEW: 'New',
    PLAYING: 'Playing',
    WINNER: 'Winner',
    TIED: 'Tied'
}
const { 
    board, 
    getColumns, 
    getDiagonals, 
    getNewTiles, 
    getRows 
} = require('./board')(BOARD_SIZE, TILE_SIZE);


let STATE = -1;
let PLAYERS = [
    { index: 0, entity: Human(board, 'X') },
    { index: 1, entity: RandomRobot(board, 'O') }
];
let CURRENT_PLAYER = PLAYERS[0];
let NEED_REDRAW = true;

/*Game logic*/
const getTilePosition = (mouseX, mouseY) => {
    return {
        x: (mouseX / TILE_SIZE) | 0,
        y: (mouseY / TILE_SIZE) | 0
    }
}

const everyXorO = tiles => _.every(tiles, tile => tile.marker === 'X')||_.every(tiles, tile => tile.marker === 'O');

const getPropOrFetchAndSet = (object, propName, fetchFunc) => { // Returns prop or sets the prop and returns new prop
    if(!object[propName]) object[propName] = fetchFunc();
    return object[propName];
}

const getWinningPlay = () => {
    let winningPlay = getPropOrFetchAndSet(board, 'columns', () => getColumns(board)).find(everyXorO) ||
                    getPropOrFetchAndSet(board, 'rows', () => getRows(board)).find(everyXorO) ||
                    getPropOrFetchAndSet(board, 'diagonals', () => getDiagonals(board)).find(everyXorO);
    return winningPlay;
}

const isTied = () => {
    return !board.tiles.find(tile => tile.marker ? false : true)
}

const setState = state => {
    console.log('%s -> %s', STATE, state);
    STATE = state;
}

const drawTile = tile => {
    fill(tile.backgroundColor);
    rect(tile.x * tile.width, tile.y * tile.height, tile.width, tile.height);

    if(tile.marker) {
        fill('#000');
        text(tile.marker, tile.x * tile.width + (tile.width / 2), tile.y * tile.height + (tile.height / 2));
    }
}

const drawBoard = board => {
    textSize(64);
    textAlign(CENTER, CENTER);

    board.tiles.forEach(drawTile);
}

const isGameOver = () => {
    const winningPlay = getWinningPlay();
    if(!winningPlay){
        if(isTied()) {
            setState(GAME_STATES.TIED);
            return true;
        }
        else {
            return false;
        } 
    }else{
        setState(GAME_STATES.WINNER);
        winningPlay.forEach(tile => tile.backgroundColor = 'green');
        return true;
    }
}


const playerMove = (type) => {
    let madeMove = false;
    switch(type) {
        case 'human':
            const { x, y } = getTilePosition(mouseX, mouseY);
            madeMove = CURRENT_PLAYER.entity.play(x, y);
        break;
        case 'robot':
            madeMove = CURRENT_PLAYER.entity.play();
        break;
    }

    if(madeMove){
        if(!isGameOver()) { // If not game over, toggle players
            CURRENT_PLAYER = PLAYERS.find(player => player.index !== CURRENT_PLAYER.index);
        }
        NEED_REDRAW = true;
    }
}

const resetTile = tile => {
    tile.backgroundColor = '#fff';
    tile.marker = null;
}

const isMouseOnBoard = () => {
    return mouseX > 0 && 
    mouseX < CANVAS_WIDTH &&
    mouseY > 0 &&
    mouseY < CANVAS_HEIGHT;
}

export function keyPressed() {
    if(STATE !== GAME_STATES.PLAYING && keyCode === SPACE_BAR) {
        board.tiles = getPropOrFetchAndSet(board, 'tiles', () => getNewTiles(board));
        board.tiles.forEach(resetTile)
        setState(GAME_STATES.PLAYING);
        NEED_REDRAW = true;
    }
}

export function mousePressed(){
    if(STATE === GAME_STATES.PLAYING && isMouseOnBoard){
        playerMove('human');
    }
    return false;
}

export function setup(){
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    board.tiles = getPropOrFetchAndSet(board, 'tiles', () => getNewTiles(board));
    setState(GAME_STATES.PLAYING);
}

export function draw(){
    if(STATE === GAME_STATES.PLAYING){
        playerMove('robot');
    }

    if(NEED_REDRAW){
        // Draw board
        drawBoard(board);
        NEED_REDRAW = false;
    }
}