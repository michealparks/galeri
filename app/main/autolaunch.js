const AutoLaunch = require('auto-launch')
const { ipcMain } = require('electron')
const { sendToMenubar } = require('./ipc')
const launcher = new AutoLaunch({ name: 'Galeri' })

launcher.isEnabled().then(function (isEnabled) {
  setTimeout(function () {
    sendToMenubar('autolaunch', isEnabled)
  }, 3000)
})

ipcMain.on('preferences', function (e, data) {
  if (typeof data.IS_AUTOLAUNCH === 'undefined') return
  return data.IS_AUTOLAUNCH ? launcher.enable() : launcher.disable()
})
