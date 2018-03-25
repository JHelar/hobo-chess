module.exports = (board, marker) => ({
    type: 'robot',
    play: () => {
        const tiles = board.filterTiles(tile => !tile.marker);
        const tile = tiles[(Math.random() * tiles.length) | 0];
        if(tile){
            tile.marker = marker;
            return true;  
        }else{
            return false;
        }
    }
})