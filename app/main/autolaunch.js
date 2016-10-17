const { ipcMain, app } = require('electron')
const AutoLaunch = require('auto-launch')

const appLauncher = new AutoLaunch({
  name: 'Galeri',
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: process.platform === 'darwin'
    ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
    : undefined // Use the default
})

let isEnabled

appLauncher.isEnabled().then(data => { isEnabled = data })

ipcMain.on('preferences', (e, data) => {
  if (data.enabled && !isEnabled) appLauncher.enable()
  if (!data.enabled && isEnabled) appLauncher.disable()

  isEnabled = data.enabled
})
