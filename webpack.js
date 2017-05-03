const __dev__ = process.argv[2] === 'dev'
const {resolve} = require('path')
const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')

const mainConfig = {
  target: 'electron-main',
  entry: resolve(__dirname, 'main.development'),
  output: {
    path: __dirname,
    filename: './main.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new BabiliPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__dev__': false
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}

const rendererConfig = {
  target: 'electron-renderer',
  entry: {
    menu: ['./app/menu'],
    clone: ['./app/bg-clone']
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(__dev__ ? 'development' : 'production'),
      '__VERSION__': JSON.stringify(require('./package.json').version),
      '__dev__': __dev__
    })
  ].concat(__dev__ ? [] : new BabiliPlugin()),
  performance: {
    hints: 'warning'
  }
}

function report (err, stats) {
  if (err) console.error(err)
  if (stats) console.log(stats.toString({ chunks: false, colors: true }))
}

if (__dev__) {
  webpack(rendererConfig).watch({ ignored: /node_modules/ }, report)
  webpack(mainConfig).watch({ ignored: /node_modules/ }, report)
} else {
  webpack(rendererConfig).run(report)
  webpack(mainConfig).run(report)
}
