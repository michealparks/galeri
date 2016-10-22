const config = require('application-config')('Galeri')
const { ipcMain } = require('electron')
const { sendToWindows } = require('./ipc')
const { minutes } = require('../util/time')

const baseConfig = {
  version: 'v0.0.3',
  refreshRate: minutes(30),
  showTextOnDesktop: true,
  autolaunch: true
}

let queue = []
let didInit = false
let cache = {}

config.read((err, data) => {
  didInit = true
  cache = data

  if (err ||
     !cache ||
     Object.keys(cache).length === 0 ||
     !cache.version) {
    cache = baseConfig
    config.write(baseConfig)
  }

  if (queue.length) return queue.forEach(fn => fn(cache))
})

ipcMain.on('preferences', (e, data) => config.write(data))

ipcMain.on('request:preferences', (e, data) => {
  if (didInit) return onReqPrefs()

  return queue.push(onReqPrefs)
})

function onReqPrefs () {
  return sendToWindows('preferences', cache)
}

function getConfig (next) {
  if (didInit) return next(cache)

  return queue.push(next)
}

module.exports = { getConfig }
