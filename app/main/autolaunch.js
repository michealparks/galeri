const AutoLaunch = require('auto-launch')
const electron = require('electron')

const launcher = new AutoLaunch({
  name: 'Galeri',
  // On Mac, work around a bug in auto-launch where it opens a Terminal window
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: electron.app.getPath('exe').split('.app/Content')[0] + '.app',
  isHidden: false
})

launcher.isEnabled().then(function (isEnabled) {
  setTimeout(function () {
    require('./ipc').sendToMenubar('autolaunch', isEnabled)
  }, 5000)
})

electron.ipcMain.on('preferences', onPrefs)
electron.ipcMain.on('cached-preferences', onPrefs)

function onPrefs (e, data) {
  if (typeof data.IS_AUTOLAUNCH === 'undefined') return
  return data.IS_AUTOLAUNCH ? launcher.enable() : launcher.disable()
}
