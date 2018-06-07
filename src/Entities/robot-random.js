export default (board, marker) => ({
    type: 'robot',
    marker,
    play: () => {
        const tiles = board.tiles.filter(tile => !tile.marker);
        const tile = tiles[(Math.random() * tiles.length) | 0];
        if(tile){
            tile.marker = marker;
            return Promise.resolve(true);  
        }else{
            return Promise.resolve(false);
        }
    }
})