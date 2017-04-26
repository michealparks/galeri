const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  target: 'electron-main',
  entry: resolve(__dirname, 'main.development'),
  output: {
    path: __dirname,
    filename: './main.js'
  },
  plugins: [
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__dev__': process.env.NODE_ENV === 'development'
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
})
