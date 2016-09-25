const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config.development')
const app = express()
const compiler = webpack(config)
const { PORT = 3000 } = process.env

const wdm = webpackDevMiddleware(compiler, {
  noInfo: true,
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true }
})

app.use(wdm)
app.use(webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))

const server = app.listen(PORT, 'localhost', err => {
  if (err) return console.error(err)

  console.log(`Listening at http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('Stopping dev server')
  wdm.close()
  server.close(() => process.exit(0))
})
