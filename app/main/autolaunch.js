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

electron.ipcMain.on('preferences-to-background', onPrefs)
electron.ipcMain.on('preferences-to-menubar', onPrefs)

function onPrefs (e, data) {
  if (data.IS_AUTOLAUNCH === undefined) return

  if (data.IS_AUTOLAUNCH) {
    launcher.enable()
  } else {
    launcher.disable()
  }
}
