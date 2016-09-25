const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const { PORT = 3000 } = process.env
const hmwScript = `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000&reload=true`

module.exports = validate(merge(baseConfig, {
  debug: true,

  entry: {
    hmr: ['react-hot-loader/patch'],
    background: ['./app/background', hmwScript],
    menu: ['./app/menu', hmwScript]
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
