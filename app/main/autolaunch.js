const { ipcMain, app } = require('electron')
const AutoLaunch = require('auto-launch')

// See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
const appPath = process.platform === 'darwin'
  ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
  : undefined // Use the default

const appLauncher = new AutoLaunch({
  name: 'Galeri',
  path: appPath
})

let isEnabled

appLauncher.isEnabled().then(function (data) {
  console.log(data)
  isEnabled = data
})

ipcMain.on('preferences', function (e, data) {
  if (data.enabled && !isEnabled) appLauncher.enable()
  if (!data.enabled && isEnabled) appLauncher.disable()

  isEnabled = data.enabled
})
