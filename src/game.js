const Board = require('./board');
const Human = require('./Entities/human');
const RandomRobot = require('./Entities/robot-random');
const _ = require('lodash');

const SPACE_BAR = 32;
const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 640;
const TILE_WIDTH = CANVAS_WIDTH / 3;
const TILE_HEIGHT = CANVAS_HEIGHT / 3;
const BOARD_SIZE = 3;
const FONT_SIZE = 16 * 5;
const GAME_STATES = {
    NEW: 'New',
    PLAYING: 'Playing',
    WINNER: 'Winner',
    TIED: 'Tied'
}


let STATE = -1;
let BOARD = new Board(BOARD_SIZE, TILE_WIDTH, TILE_HEIGHT);
let PLAYERS = [
    { index: 0, entity: Human(BOARD, 'X') },
    { index: 1, entity: RandomRobot(BOARD, 'O') }
];
let CURRENT_PLAYER = PLAYERS[0];
let NEED_REDRAW = true;

/*Game logic*/
const getTilePosition = (mouseX, mouseY) => {
    return {
        x: (mouseX / TILE_WIDTH) | 0,
        y: (mouseY / TILE_HEIGHT) | 0
    }
}

const everyXorO = tiles => _.every(tiles, tile => tile.marker === 'X')||_.every(tiles, tile => tile.marker === 'O');

const getWinningPlay = () => {
    let winningPlay = BOARD.getColumns().find(everyXorO) ||
                    BOARD.getRows().find(everyXorO) ||
                    BOARD.getDiagonals().find(everyXorO);
    return winningPlay;
}

const isTied = () => {
    return !BOARD.findTile(tile => tile.marker ? false : true)
}

const setState = state => {
    console.log('%s -> %s', STATE, state);
    STATE = state;
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
        winningPlay.forEach(tile => tile.setBackgroundColor('green'));
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

const isMouseOnBoard = () => {
    return mouseX > 0 && 
    mouseX < CANVAS_WIDTH &&
    mouseY > 0 &&
    mouseY < CANVAS_HEIGHT;
}

export function keyPressed() {
    if(STATE !== GAME_STATES.PLAYING && keyCode === SPACE_BAR) {
        BOARD.setBoard();
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
    BOARD.setBoard();
    setState(GAME_STATES.PLAYING);
}

export function draw(){
    if(STATE === GAME_STATES.PLAYING){
        playerMove('robot');
    }

    if(NEED_REDRAW){
        // Draw board
        BOARD.draw();
        NEED_REDRAW = false;
    }
}