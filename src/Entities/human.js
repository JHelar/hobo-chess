module.exports = (board, marker) => ({
    type: 'human',
    play: (tileX, tileY) => {
        let tile = board.findTile(tile => {
            const position = tile.getPosition();
            return position.x === tileX && position.y === tileY && !tile.marker;
        })
        if(tile){
            tile.marker = marker;
            return true;  
        }else{
            return false;
        }
    }
})