

export default function History(){
    this.history = [];
    
    this.push = board => {
        this.history.push(board.tiles.slice(0).map(tile => Object.assign({}, tile)));
    }

    this.archive = () => {
        return new Promise((res, rej) => {
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