const { resolve } = require('path')
const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = validate(merge(baseConfig, {
  entry: resolve(__dirname, 'main.development'),

  output: {
    path: __dirname,
    filename: './main.js'
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  }
}))
