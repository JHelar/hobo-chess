const nextPossibleTile = board => board.titles.find(tile => !tile.marker);

module.exports = (board, marker) => ({
    type: 'robot',
    marker,
    play: () => {
        const tile = nextPossibleTile(board);
        if(tile){
            tile.marker = marker;
            return true;  
        }else{
            return false;
        }
    }
})