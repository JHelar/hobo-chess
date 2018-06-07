import { Human, RobotLookup, RobotRandom } from './Entities';
const _ = require('lodash');

import {
    makeBoard,
    getColumns,
    getRows,
    getDiagonals,
    getNewTiles
} from './board';
import History from './history';

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
const TOTAL_PLAYS = 500;
const GAME_HISTORY = new History();
const board = makeBoard(BOARD_SIZE, TILE_SIZE);


let MOVING = false;
let STATE = -1;
let playCount = 0;
let PLAYERS = [
    { index: 0, entity: Human(board, 'X') },
    { index: 1, entity: RobotLookup(board, 'O') }
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

const everyXorO = tiles => _.every(tiles, tile => tile.marker === 'X') || _.every(tiles, tile => tile.marker === 'O');

const getPropOrFetchAndSet = (object, propName, fetchFunc) => { // Returns prop or sets the prop and returns new prop
    if (!object[propName]) object[propName] = fetchFunc();
    return object[propName];
}

const getWinningPlay = () => {
    let winningPlay = getPropOrFetchAndSet(board, 'columns', () => getColumns(board)).find(everyXorO) ||
        getPropOrFetchAndSet(board, 'rows', () => getRows(board)).find(everyXorO) ||
        getPropOrFetchAndSet(board, 'diagonals', () => getDiagonals(board)).find(everyXorO);
    return winningPlay;
}

const isTied = () => {
    return !board.tiles.find(tile => !tile.marker)
}

const setState = state => {
    console.log('%s -> %s', STATE, state);
    STATE = state;
}

const drawTile = tile => {
    fill(tile.backgroundColor);
    rect(tile.x * tile.width, tile.y * tile.height, tile.width, tile.height);

    if (tile.marker) {
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
    if (!winningPlay) {
        if (isTied()) {
            return GAME_STATES.TIED;
        }
        else {
            return false;
        }
    } else {
        winningPlay.forEach(tile => tile.backgroundColor = 'green');
        return GAME_STATES.WINNER;
    }
}

const madeMove = didMove => {
    if(didMove) {
        const state = isGameOver()
        if (!state) { // If not game over, toggle players
            GAME_HISTORY.push(board, CURRENT_PLAYER.entity.marker);
            CURRENT_PLAYER = PLAYERS.find(player => player.index !== CURRENT_PLAYER.index);
            MOVING = false;
        } else {
            if (state === GAME_STATES.WINNER) {
                GAME_HISTORY.push(board, CURRENT_PLAYER.entity.marker, true);
            } else if (state === GAME_STATES.TIED) {
                GAME_HISTORY.push(board, CURRENT_PLAYER.entity.marker, true)
            }

            GAME_HISTORY.archive()
                .then(() => setState(state))
                .catch(err => alert(err))
        }
        NEED_REDRAW = true;
    }
}

const playAndCheck = type => {
    switch (type) {
        case 'human':
            if(CURRENT_PLAYER.entity.type === 'human') {
                MOVING = true;
                const { x, y } = getTilePosition(mouseX, mouseY);
                CURRENT_PLAYER.entity.play(x, y).then(madeMove);
            }
            break;
        case 'robot':
            if(CURRENT_PLAYER.entity.type === 'robot') {
                MOVING = true;
                CURRENT_PLAYER.entity.play().then(madeMove);
            }
            break;
    }
}

const resetGame = () => {
    board.tiles = getPropOrFetchAndSet(board, 'tiles', () => getNewTiles(board));
    board.tiles.forEach(resetTile)
    setState(GAME_STATES.PLAYING);
    NEED_REDRAW = true;
    playCount++;
    MOVING = false;
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
    if (STATE !== GAME_STATES.PLAYING && keyCode === SPACE_BAR) {
        resetGame();
    }
}

export function mousePressed() {
    if (STATE === GAME_STATES.PLAYING && isMouseOnBoard()) {
        playAndCheck('human');
    }
    return false;
}

export function setup() {
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    board.tiles = getPropOrFetchAndSet(board, 'tiles', () => getNewTiles(board));
    setState(GAME_STATES.PLAYING);
}

export function draw() {
    if (STATE === GAME_STATES.PLAYING && !MOVING) {
        playAndCheck('robot');
    }
    else if((STATE === GAME_STATES.TIED || STATE === GAME_STATES.WINNER) && playCount < TOTAL_PLAYS) {
        playCount++;
        resetGame();
    }
    if (NEED_REDRAW) {
        // Draw board
        drawBoard(board);
        NEED_REDRAW = false;
    }
}