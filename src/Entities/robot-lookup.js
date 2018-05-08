import { calculateS } from '../boardCalcs';

const get_p = s => {
    return fetch('/api/p' + s)
        .then(res => res.json())
        .then(json => {
            if(json.status === 'OK') return json.data;
            else return -1;
        })
}

const getPossibleStates = (board, marker) => {
    const states = [];
    const boardCopy = board.slice(0).map(tile => Object.assign({}, tile));
    boardCopy.filter(tile => !tile.marker).forEach(tile => {
        tile.marker = marker
        const s = calculateS(boardCopy, marker)
        tile.marker = false;

        states.push(get_p(s).then(p => ({
            p,
            number: tile.tileNumber
        })))
    });

    return Promise.all(states);
}

module.exports = (board, marker) => ({
    type: 'robot',
    marker,
    play: () => {
        getPossibleStates(board, marker)
            .then(states => {
                if(tile){
                    tile.marker = marker;
                    return true;  
                }else{
                    return false;
                }
            })
    }
})