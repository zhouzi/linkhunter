var webpack = require('webpack');

module.exports = {
  entry: './src/linkHunter.js',

  output: {
    path: __dirname + '/dist',
    filename: 'linkHunter.min.js'
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
