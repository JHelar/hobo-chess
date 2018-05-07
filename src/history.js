const MAGIC_CONST = 0.5;

const exportTile = (tile, index, board) => ({
    x: tile.x,
    y: tile.y,
    marker: tile.marker ? tile.marker === 'X' ? -1 : 1 : 0,
})

const calculateS = (board, marker) => {
    return board.tiles.reduce((value, tile) => {
        if(tile.marker === marker) {
            value += Math.pow(0.5, tile.tileNumber)
        }
        return value;
    }, 0)
}

const calculateP = (state, prev_state) => state + (MAGIC_CONST * ( state - prev_state ));

export default function History(){
    this.history = [];
    
    this.push = (board, player, winner) => {
        this.history.push({
            board: board.tiles.slice(0).map(exportTile),
            success: {
                s_x: calculateS(board, 'X'),
                s_o: calculateS(board, 'O'),
                p_x: 0.5,
                p_o: 0.5,
                winner
            },
            player
        });
    }

    this.setP = () => {
        const reversedHistory = this.history.reverse();

        const xHistory = reversedHistory.filter(state => {
            console.log(state)
            return state.player === 'X';
        })
    
        const oHistory = reversedHistory.filter(state => {
            return state.player === 'O';
        })
    
        xHistory.forEach((state, index, array) => {
            if(state.winner) {
                state.success.p_x = 1;
            }else {
                const prevState = array[index - 1];
                if(prevState) {
                    state.success.p_x = calculateP(state.success.p_x, prevState.success.p_x);
                }else {
                    state.success.p_x = calculateP(state.success.p_x, 0);
                }
            }
        })
    
        oHistory.forEach((state, index, array) => {
            if(state.winner) {
                state.success.p_o = 1;
            }else {
                const prevState = array[index - 1];
                if(prevState) {
                    state.success.p_o = calculateP(state.success.p_o, prevState.success.p_o);
                }else {
                    state.success.p_o = calculateP(state.success.p_o, 0);
                }
            }
        })

        console.log(xHistory, oHistory)
    }

    this.archive = () => {
        return new Promise((res, rej) => {
            this.setP();

            fetch('/api/archive', { 
                method: 'POST', 
                body: JSON.stringify({game:this.history}), 
                headers: { 'content-type': 'application/json' }
            })
            .then(res => res.json())
            .then(json => {
                if(json.status === 'OK') {
                    this.history.splice(0); // Empty the history.
                    res(json);
                }
                else rej(json);
            })
        })
    }
}