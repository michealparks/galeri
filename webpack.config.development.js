const webpack = require('webpack')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = validate(merge(baseConfig, {
  debug: true,

  entry: {
    background: ['./app/background'],
    menu: ['./app/menu']
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  target: 'electron-renderer'
}))
