const { resolve } = require('path')
const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = validate(merge(baseConfig, {
  target: 'electron-main',
  entry: resolve(__dirname, 'main.development'),
  output: {
    path: __dirname,
    filename: './main.js'
  },
  plugins: [
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}))
