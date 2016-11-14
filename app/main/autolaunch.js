const AutoLaunch = require('auto-launch')
const { ipcMain } = require('electron')
const { sendToMenubar } = require('./ipc')
const launcher = new AutoLaunch({ name: 'Galeri' })

let isEnabled

launcher.isEnabled().then(function (data) {
  isEnabled = data
  setTimeout(function () {
    sendToMenubar('autolaunch', isEnabled)
  }, 3000)
})

ipcMain.on('preferences', function (e, data) {
  if (!data.autolaunch || data.autolaunch === isEnabled) return

  return data.autolaunch
    ? launcher.enable()
    : launcher.disable()
})
