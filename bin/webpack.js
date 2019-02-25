const webpack = require('webpack')
const path = require('path')
const cp = require('child_process')

const __dev = process.env.NODE_ENV === 'development'
const __platform = process.argv[3] || process.platform

const config = {
  mode: __dev ? 'development' : 'production',
  devtool: false,
  node: {
    __dirname: false,
    __filename: false,
  },
  target: 'electron-main',

  entry: path.resolve(__dirname, '..', 'src', 'main.js'),
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'main.js'
  },
  externals: [
    function (context, req, cb) {
      return [
        // 'wallpaper'
      ].indexOf(req) > -1 ? cb(null, `require('${req}')`) : cb()
    }
  ],
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __dev: __dev,
      __macOS: __platform === 'darwin',
      __linux: __platform === 'linux',
      __windows: __platform === 'win32'
    })
  ]
}

function log (err, stats) {
  if (err) {
    console.error(err)
  }

  if (stats) {
    console.log(stats.toString({chunks: false, colors: true}))
  }
}

function watch () {
  webpack(config).watch({}, log)
}

function compile () {
  webpack(config).run(log)
}

if (__dev) {
  watch()
} else {
  compile()
}
