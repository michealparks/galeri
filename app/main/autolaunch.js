const AutoLaunch = require('auto-launch')
const electron = require('electron')
const {toMenubar} = require('./ipc')

const launcher = new AutoLaunch({
  name: 'Galeri',
  // On Mac, work around a bug in auto-launch where it opens a Terminal window
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: electron.app.getPath('exe').split('.app/Content')[0] + '.app',
  isHidden: false
})

launcher.isEnabled().then(isEnabled =>
  setTimeout(() =>
    toMenubar('main:is-autolaunch-enabled', isEnabled), 3000))

electron.ipcMain.on('menubar:is-autolaunch-enabled', (e, isEnabled) =>
  isEnabled
    ? launcher.enable()
    : launcher.disable())
