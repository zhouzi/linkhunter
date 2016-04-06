var webpack = require('webpack');

module.exports = {
    entry: './src/linkhunter.js',

    output: {
        path: __dirname + '/dist',
        filename: 'linkhunter.min.js',
        library: 'linkhunter',
        libraryTarget: 'umd'
    },

    plugins: [new webpack.optimize.UglifyJsPlugin()]
};
