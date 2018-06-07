import { calculateS } from '../boardCalcs';

const get_p = (s, marker) => {
    return fetch(`/api/p/${marker}/${s}`)
        .then(res => res.json())
        .then(json => {
            if (json.status === 'OK') return json.data;
            else return -1;
        })
}

const getPossibleStates = (board, marker) => {
    const states = [];
    const tilesCopy = board.tiles.slice(0).map(tile => Object.assign({}, tile));

    tilesCopy.filter(tile => !tile.marker).forEach(tile => {
        tile.marker = marker
        const s = calculateS(tilesCopy, marker)
        tile.marker = false;

        states.push(get_p(s, marker).then(p => ({
            p,
            number: tile.tileNumber
        })))
    });

    return Promise.all(states);
}

const sortBestState = (a, b) => a.p > b.p ? -1 : b.p > a.p ? 1 : 0;
const getBestState = states => states.sort(sortBestState)[0];

export default (board, marker) => ({
    type: 'robot',
    marker,
    play: () => {
        return new Promise((res, rej) => {
            getPossibleStates(board, marker)
                .then(getBestState)
                .then(state => {
                    const tile = board.tiles.find(tile => tile.tileNumber === state.number);
                    if(tile) {
                        tile.marker = marker;
                        res(true);
                    }else {
                        res(false);
                    }
                })
        })
    }
})