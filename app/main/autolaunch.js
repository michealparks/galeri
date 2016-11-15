const AutoLaunch = require('auto-launch')
const { app, ipcMain } = require('electron')
const { sendToMenubar } = require('./ipc')

const launcher = new AutoLaunch({
  name: 'Galeri',
  // On Mac, work around a bug in auto-launch where it opens a Terminal window
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: app.getPath('exe').split('.app/Content')[0] + '.app',
  isHidden: false
})

launcher.isEnabled().then(function (isEnabled) {
  setTimeout(function () {
    sendToMenubar('autolaunch', isEnabled)
  }, 3000)
})

ipcMain.on('preferences', function (e, data) {
  if (typeof data.IS_AUTOLAUNCH === 'undefined') return
  return data.IS_AUTOLAUNCH ? launcher.enable() : launcher.disable()
})
