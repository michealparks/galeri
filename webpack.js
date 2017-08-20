const __dev__ = process.argv[2] === 'dev'
const __watch__ = process.argv[3] === 'watch'
const __platform__ = process.argv[4] || process.platform
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

const constants = {
  'process.env.NODE_ENV': JSON.stringify(__dev__ ? 'development' : 'production'),
  '__VERSION__': JSON.stringify(require('./package.json').version),
  '__dev__': __dev__,
  '__darwin__': __platform__ === 'darwin',
  '__linux__': __platform__ === 'linux',
  '__win32__': __platform__ === 'win32'
}

const mainConfig = {
  target: 'electron-main',
  entry: resolve(__dirname, 'main.development'),
  output: {
    path: __dirname,
    filename: './main.js'
  },
  externals: makeExternals([]),
  plugins: [
    new webpack.DefinePlugin(constants)
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
  externals: makeExternals([]),
  plugins: [
    new webpack.DefinePlugin(constants)
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
