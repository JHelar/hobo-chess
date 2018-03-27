module.exports = (board, marker) => ({
    type: 'human',
    play: (tileX, tileY) => {
        let tile = board.tiles.find(tile => tile.x === tileX && tile.y === tileY && !tile.marker)
        if(tile){
            tile.marker = marker;
            return true;  
        }else{
            return false;
        }
    }
})