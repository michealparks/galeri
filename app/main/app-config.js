const { assign, keys } = Object
const config = require('application-config')('galeri_config')
const { ipcMain } = require('electron')
const { sendToWindows } = require('./ipc')
const { hours } = require('../util/time')

let isCacheLoaded = false
let cacheRequests = []
let cache = {}
const baseConfig = {
  refreshRate: hours(1),
  showDescriptionOnDesktop: false,
  autolaunch: true
}

config.read((err, data) => {
  if (err) return console.error(err)

  cache = data
  isCacheLoaded = true

  cacheRequests.forEach(req => req(cache))

  if (keys(cache).length === 0) {
    setConfig(baseConfig)
  }

  sendToWindows('preferences', cache)
})

const setConfig = (...args) => {
  const newConfig = args[0]
  const optns = args.length === 3 ? args[1] : null
  const callback = optns ? args[3] : args[2]

  assign(cache, newConfig)

  if (optns && !optns.shallow) config.write(cache, callback)
}

const getConfig = callback => isCacheLoaded
  ? callback(cache)
  : cacheRequests.push(callback)

// Trash the stored config
// config.trash((err) => {})

ipcMain.on('preferences.showDescriptionOnDesktop', setConfig)
ipcMain.on('preferences.refreshRate', setConfig)
ipcMain.on('preferences.autolaunch', setConfig)

module.exports = {
  getConfig
}
