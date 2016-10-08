const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = validate(merge(baseConfig, {
  entry: {
    background: ['./app/background'],
    menu: ['./app/menu']
  },
  output: { publicPath: '../dist/' },

  plugins: [
    // new BabiliPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  target: 'electron-renderer'
}))
