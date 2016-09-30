const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const { PORT = 3000 } = process.env
const hmwScript = `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`

module.exports = validate(merge(baseConfig, {
  debug: true,

  entry: {
    hmr: [hmwScript],
    background: ['./app/background'],
    menu: ['./app/menu']
  },

  output: {
    publicPath: `http://localhost:${PORT}/dist/`
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  target: 'electron-renderer'
}))
