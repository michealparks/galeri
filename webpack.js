const __dev__ = process.argv[2] === 'dev'
const __watch__ = process.argv[3] === 'watch'
const __platform__ = process.argv[4] || process.platform
const {resolve} = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const runStylus = require('./bin/stylus')

const uglify = new UglifyJsPlugin({
  parallel: true,
  uglifyOptions: {
    ecma: 6,
    warnings: true,
    compress: {
      drop_console: true,
      ecma: 6,
      keep_infinity: true,
      // removes unused top level functions
      // toplevel: true,
      passes: 1,
      // Some code runs faster in the Chrome V8 engine if this option is disabled
      reduce_funcs: false
    }
  }
})

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
  mode: __dev__ ? 'development' : 'production',
  devtool: false,
  target: 'electron-main',
  entry: resolve(__dirname, 'app', 'electron', 'index.js'),
  output: {
    path: __dirname,
    filename: './main.js'
  },
  externals: makeExternals(['node-fetch', 'wallpaper']),
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(constants)
  ].concat(__dev__ ? [] : uglify),
  node: {
    __dirname: false,
    __filename: false
  }
}

const rendererConfig = {
  mode: __dev__ ? 'development' : 'production',
  devtool: false,
  target: 'electron-renderer',
  entry: {
    image: ['./app/window-image'],
    menu: ['./app/menu'],
    favorites: ['./app/favorites'],
    about: ['./app/about']
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  // externals: makeExternals([]),
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(constants)
  ].concat(__dev__ ? [] : uglify),
  performance: {hints: 'warning'}
}

const webpackRun = ({watch}) => Promise.all([
  pack(rendererConfig, watch),
  pack(mainConfig, watch),
  runStylus({watch})
])

const pack = (config, watch) => new Promise((resolve, reject) => {
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

const report = (err, stats) => {
  if (err) console.error(err)
  if (stats) console.log(stats.toString({chunks: false, colors: true}))
  return true
}

if (__dev__) {
  webpackRun({watch: __watch__})
    .catch(err => console.error(err))
} else {
  webpackRun({watch: false})
    // .then(html)
    .then(() => console.log('finished compiling'))
    .catch(err => console.error(err))
}
