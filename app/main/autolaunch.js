const { ipcMain, app } = require('electron')
const AutoLaunch = require('auto-launch')
const { sendToMenubar } = require('./ipc')
const { getConfig, setConfig } = require('./app-config')

// See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
const appPath = process.platform === 'darwin'
  ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
  : undefined // Use the default

const appLauncher = new AutoLaunch({
  name: 'Galeri',
  path: appPath
})

const init = () => {
  // get autolaunch setting from config
  getConfig(({ autolaunch }) => {
    sendToMenubar('auto-launch', { enabled: autolaunch })

    // if autolaunch is disabled then disable, else enable
    appLauncher.isEnabled().then(enabled => {
      if (!enabled && autolaunch) appLauncher.enable()
      if (enabled && !autolaunch) appLauncher.disable()
    })
  })
}

ipcMain.on('preferences:set-auto-launch', (e, { enabled }) => {
  if (enabled) appLauncher.enable()
  else appLauncher.disable()

  setConfig({ autolaunch: enabled })
})

module.exports = init
