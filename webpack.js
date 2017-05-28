const __dev__ = process.argv[2] === 'dev'
const __watch__ = process.argv[3] === 'watch'
const env = JSON.stringify(__dev__ ? 'development' : 'production')
const {resolve} = require('path')
const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const html = require('./bin/html')
const runStylus = require('./bin/stylus')

const makeExternals = (ignores) => [
  (context, request, callback) =>
    ignores.indexOf(request) >= 0
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
  externals: makeExternals([]),
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
    favorites: ['./app/favorites'],
    about: ['./app/about']
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
  externals: makeExternals([]),
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

if (__dev__) {
  webpackRun({ watch: __watch__ })
    .catch(err => console.error(err))
} else {
  webpackRun({ watch: false })
    .then(html)
    .then(() => console.log('finished compiling'))
    .catch(err => console.error(err))
}

function webpackRun ({ watch }) {
  return Promise.all([
    pack(rendererConfig, watch),
    pack(mainConfig, watch),
    runStylus({ watch })
  ])
}

function pack (config, watch) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    if (watch) {
      compiler.watch({}, report)
      resolve()
    } else {
      compiler.run((err, stats) => err
        ? report(err) && reject(err)
        : report(null, stats) && resolve())
    }
  })
}

function report (err, stats) {
  if (err) console.error(err)
  if (stats) console.log(stats.toString({ chunks: false, colors: true }))
  return true
}
