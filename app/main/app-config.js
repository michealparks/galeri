const { assign, keys } = Object
const config = require('application-config')('Galeri')
const { ipcMain } = require('electron')
const { sendToWindows } = require('./ipc')

let cache = {}
const baseConfig = {
  refreshRate: 1,
  showDescriptionOnDesktop: false,
  autolaunch: true
}

config.read((err, data) => {
  if (err) return console.error(err)

  cache = data

  if (keys(cache).length === 0) {
    setConfig(baseConfig)
  }

  sendToWindows('preferences', cache)
})

const setConfig = newConfig => {
  assign(cache, newConfig)
  config.write(cache, (err) => console.error(err))
}

// Trash the stored config
// config.trash((err) => {})

ipcMain.on('preferences.showDescriptionOnDesktop', setConfig)
ipcMain.on('preferences.refreshRate', setConfig)
ipcMain.on('preferences.autolaunch', setConfig)
