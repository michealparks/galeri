const config = require('application-config')('Galeri')
const { ipcMain } = require('electron')
const { sendToWindows } = require('./ipc')
const { minutes } = require('../util/time')

const baseConfig = {
  refreshRate: minutes(30),
  showTextOnDesktop: true,
  autolaunch: true
}

let queue
let didInit = false
let cache = {}

config.read(function (err, data) {
  didInit = true
  cache = data

  if (err) return console.error(err)

  if (!cache || Object.keys(cache).length === 0) {
    cache = baseConfig
    config.write(baseConfig)
  }

  if (queue) queue(cache)
})

ipcMain.on('preferences', function (e, data) {
  config.write(data)
})

ipcMain.on('request:preferences', function (e, data) {
  sendToWindows('preferences', cache)
})

function getConfig (next) {
  if (didInit) return next(cache)

  queue = next
}

module.exports = { getConfig }
