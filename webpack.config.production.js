const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const BabiliPlugin = require('babili-webpack-plugin')
const baseConfig = require('./webpack.config.base')
const env = JSON.stringify('production')

module.exports = validate(merge(baseConfig, {
  target: 'electron-renderer',

  entry: { menu: ['./app/menu'] },

  plugins: [
    new BabiliPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': env })
  ]
}))
