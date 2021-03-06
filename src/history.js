import { calculateP, calculateS } from './boardCalcs';

let MAGIC_CONST = 0.5;

const exportTile = (tile, index, board) => ({
    x: tile.x,
    y: tile.y,
    marker: tile.marker ? tile.marker === 'X' ? -1 : 1 : 0,
})



export default function History(){
    this.history = [];
    
    this.push = (board, player, winner) => {
        this.history.push({
            success: {
                s_x: calculateS(board.tiles, 'X'),
                s_o: calculateS(board.tiles, 'O'),
                p_x: 0.5,
                p_o: 0.5,
                winner: winner || false
            },
            player
        });
    }

    this.setP = () => {
        const reversedHistory = this.history.slice(0).reverse();

        const xHistory = reversedHistory.filter(state => state.player === 'X')
        const oHistory = reversedHistory.filter(state => state.player === 'O')
    
        xHistory.forEach((state, index, array) => {
            if(state.success.winner) {
                state.success.p_x = 1;
            }else {
                const prevState = array[index - 1];
                if(prevState) {
                    state.success.p_x = calculateP(state.success.p_x, prevState.success.p_x, MAGIC_CONST);
                }else {
                    state.success.p_x = 0;
                }
            }
        })
    
        oHistory.forEach((state, index, array) => {
            if(state.success.winner) {
                state.success.p_o = 1;
            }else {
                const prevState = array[index - 1];
                if(prevState) {
                    state.success.p_o = calculateP(state.success.p_o, prevState.success.p_o, MAGIC_CONST);
                }else {
                    state.success.p_o = 0;
                }
            }
        })
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
                    MAGIC_CONST -= 0.01 // Decrease Magic.
                    if(MAGIC_CONST < 0) MAGIC_CONST = 0;
                    res(json);
                }
                else rej(json);
            })
        })
    }
}