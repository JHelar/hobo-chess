const Tile = function(x, y, tileNumber, width, height){
    // Set position
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this.marker = null;
    this._backgroundColor = '#fff';
    this._tileNumber = tileNumber;

    this.init = () => {
        this.marker = null;
        this._backgroundColor = '#fff';
    }

    this.reset = this.init;

    this.setBackgroundColor = color => this._backgroundColor = color;

    this.getPosition = () => ({x: this._x, y: this._y});

    this.draw = () => {
        fill(this._backgroundColor)
        rect(this._x * this._width, this._y * this._height, this._width, this._height);

        if(this.marker){
            fill('#000');
            text(this.marker, this._x * this._width + (this._width / 2), this._y * this._height + (this._height / 2));
        }
    }

    this.init();
}

module.exports = Tile;