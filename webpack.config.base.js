module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: require('path').join(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [],
  externals: []
}
