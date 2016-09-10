var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  externals: {
    'babel-polyfill': 'babel-polyfill'
  },
  output: {
    libraryTarget: 'umd',
    library: 'aa2',
    filename: './dist/aa2.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]
};
