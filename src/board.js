const Tile = require('./tile');

export const getNewTiles = board => {
    const tiles = [];
    let tileNumber = 1;
    for(let x = 0; x < board.size; x++){
        for(let y = 0; y < board.size; y++){
            tiles.push(Tile(x, y, tileNumber, board.tileSize, board.tileSize));
            tileNumber++;
        }
    }
    return tiles;
}

export const getDiagonals = board => {
    const rows = board.rows || getRows(board);
  
    let incrementer = 0;
    return rows.reduce((acc, row, index) => {
        if(!acc[0] && !acc[1]) {
            acc[0] = [];
            acc[1] = [];
        }
        
        let index0 = incrementer;
        let index1 = (row.length - 1) - incrementer;
        
        acc[0].push(row[index0]);
        acc[1].push(row[index1]);
        
        incrementer += index > ((rows.length / 2) | 0) ? -1 : 1;

        return acc;
    }, []);

    return this._diagonals;
}

export const getColumns = board => {
    return board.tiles.reduce((acc, tile) => {
        const key = tile.tileNumber % board.size;
        if(!acc[key]) acc[key] = [];
        acc[key].push(tile);

        return acc;
    }, []);
}

export const getRows = board => {
    const rows = [];

    for(let index = 0 ; index < board.tiles.length; index += board.size) {
        rows.push(board.tiles.slice(index, index + board.size));
    }
    return rows;
}

export const makeBoard = (boardSize, tileSize) => {
    let tiles = null,
        rows = null,
        columns = null,
        diagonals = null;
    
    return {
        size: boardSize,
        tileSize,
        tiles,
        rows,
        columns,
        diagonals
    }
};