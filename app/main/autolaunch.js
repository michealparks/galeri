const { app, ipcMain } = require('electron')
const AutoLaunch = require('auto-launch')

const appLauncher = new AutoLaunch({
  name: 'Galeri',
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: process.platform === 'darwin'
    ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
    : undefined // Use the default
})

let isEnabled

appLauncher.isEnabled().then(data => {
  isEnabled = data
})

ipcMain.on('preferences', (e, data) => {
  if (!data.autolaunch || data.autolaunch === isEnabled) return

  return data.autolaunch
    ? appLauncher.enable()
    : appLauncher.disable()
})
