const __devOnce__ = process.argv[2] === 'dev-once'
const __dev__ = process.argv[2] === 'dev' || __devOnce__
const env = JSON.stringify(__dev__ ? 'development' : 'production')
const {resolve} = require('path')
const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')

const IGNORES = ['sharp', 'open']

const externals = [
  (context, request, callback) =>
    IGNORES.indexOf(request) >= 0
      ? callback(null, `require('${request}')`)
      : callback()
]

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
  externals: externals,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': env,
      '__dev__': __dev__
    })
  ].concat(__dev__ ? [] : new BabiliPlugin()),
  node: {
    __dirname: false,
    __filename: false
  }
}

const rendererConfig = {
  target: 'electron-renderer',
  entry: {
    background: ['./app/background'],
    menu: ['./app/menu'],
    clone: ['./app/bg-clone'],
    favorites: ['./app/favorites']
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
  externals: externals,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': env,
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

if (__dev__ && !__devOnce__) {
  webpack(rendererConfig).watch({ ignored: /node_modules/ }, report)
  webpack(mainConfig).watch({ ignored: /node_modules/ }, report)
} else {
  webpack(rendererConfig).run(report)
  webpack(mainConfig).run(report)
}
