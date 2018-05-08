const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');

let history = {};
fs.readFile('history.json', (err, data) => {
    if(!err) {
        try{
            history = JSON.parse(data);
        }catch(e){
            console.error(e)
        }
    }
})

const STATUS = {
    OK: 'OK',
    NOT_OK: 'NOT_OK'
};

const addToHistory = game => {
    history = game.reduce((value, state) => {
        if(!value[state.success.s_x] || state.success.p_x != 0.5) value[state.success.s_x] = state.success.p_x;
        if(!value[state.success.s_o] || state.success.p_o != 0.5) value[state.success.s_o] = state.success.p_o;

        return value;
    }, history)
}

const makeResponse = (status, data) => ({
    status,
    data
})

const saveToFile = (data, filePath) => {
    return new Promise((res, rej) => {
        fs.writeFile(filePath, data, err => {
            if(err) rej(err);
            else res();
        })
    })
}

app.use(express.static('dist'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/api/p/:state', (req, res) => {
    const p = history[req.params.state.replace('_', '.')];
    if(p){
        res.send(JSON.stringify(makeResponse(STATUS.OK, p)))
    }else {
        res.send(JSON.stringify(makeResponse(STATUS.NOT_OK, 'Nope')))
    }
})

app.post('/api/archive', (req, res) => {
    try{
        const requestObject =  req.body;
        if(requestObject.game){
            addToHistory(requestObject.game);
            
            saveToFile(JSON.stringify(history), 'history.json')
                .then(() => res.send(JSON.stringify(makeResponse(STATUS.OK))))
                .catch(err => res.send(JSON.stringify(makeResponse(STATUS.NOT_OK, err.messages))))
        }else {
            res.send(JSON.stringify(makeResponse(STATUS.NOT_OK, 'Invalid request object')));
        }

    }catch(e){
        res.send(JSON.stringify(makeResponse(STATUS.NOT_OK, e.message)))
    }
})

app.listen(8080);