var webpack = require('webpack');

module.exports = {
    entry: './src/entry.js',

    output: {
        path: __dirname + '/dist',
        filename: 'LinkHunter.min.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader']
            }
        ]
    },

    plugins: [new webpack.optimize.UglifyJsPlugin()]
};
