const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    watch: true,
    target: 'node',
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}