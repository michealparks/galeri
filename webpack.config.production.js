const webpack = require('webpack')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  target: 'electron-renderer',
  entry: {
    menu: ['./app/menu']
  },
  plugins: [
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__VERSION__': JSON.stringify(require('./package.json').version),
      '__dev__': false
    })
  ]
})
