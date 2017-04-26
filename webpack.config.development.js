const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  target: 'electron-renderer',
  entry: {
    menu: ['./app/menu'],
    clone: ['./app/bg-clone']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__VERSION__': JSON.stringify(require('./package.json').version),
      '__dev__': process.env.NODE_ENV === 'development'
    })
  ]
})
