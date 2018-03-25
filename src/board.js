const Tile = require('./tile');

const Board = function(boardSize, tileWidth, tileHeight) {
    this._columnCount = boardSize;
    this._rowCount = boardSize;
    this._tileWidth = tileWidth;
    this._tileHeight = tileHeight;
    this._board = null;
    this._rows = null;
    this._columns = null;
    this._diagonals = null;

    this.setBoard = () => {
        if(this._board){
            this._board.forEach(tile => tile.reset());
        }else{
            this._board = [];
            let tileNumber = 1;
            for(let x = 0; x < this._columnCount; x++){
                for(let y = 0; y < this._rowCount; y++){
                    this._board.push(new Tile(x, y, tileNumber, this._tileWidth, this._tileHeight));
                    tileNumber++;
                }
            }
        }
        return this._board;
    }

    this.getColumns = () => {
        if(this._columns) return this._columns;

        this._columns = this._board.reduce((acc, tile) => {
            const key = tile._tileNumber % this._columnCount;
            if(!acc[key]) acc[key] = [];
            acc[key].push(tile);
    
            return acc;
        }, []);

        return this._columns;
    }
    
    this.getRows = () => {
        if(this._rows) return this._rows;

        this._rows = [];
    
        for(let index = 0 ; index < this._board.length; index += this._rowCount) {
            this._rows.push(this._board.slice(index, index + this._rowCount));
        }
        return this._rows;
    }

    this.getDiagonals = () => {
        if(this._diagonals) return this._diagonals;

        const rows = this.getRows();
      
        let incrementer = 0;
        this._diagonals = rows.reduce((acc, row, index) => {
            if(!acc[0] && !acc[1]) {
                acc[0] = [];
                acc[1] = [];
            }
            
            let index0 = incrementer;
            let index1 = (row.length - 1) - incrementer;
            
            acc[0].push(row[index0]);
            acc[1].push(row[index1]);
            
            incrementer += index > ((rows.length / 2) | 0) ? -1 : 1;
    
            return acc;
        }, []);

        return this._diagonals;
    }

    this.findTile = iteratee => {
        return this._board.find(iteratee);
    }

    this.filterTiles = iteratee => this._board.filter(iteratee);

    this.draw = () => {
        textSize(64);
        textAlign(CENTER, CENTER);

        this._board.forEach(tile => tile.draw());
    }
}

module.exports = Board;