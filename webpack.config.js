var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"'
    })
  ]
};
