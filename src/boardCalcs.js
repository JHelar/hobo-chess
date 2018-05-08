export const calculateS = (board, marker) => {
    return board.tiles.reduce((value, tile) => {
        if(tile.marker === marker) {
            value += Math.pow(0.5, tile.tileNumber)
        }
        return value;
    }, 0)
}

export const calculateP = (state, prev_state) => prev_state + (MAGIC_CONST * ( state - prev_state ));