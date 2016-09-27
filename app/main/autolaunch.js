const { ipcMain } = require('electron')
const AutoLaunch = require('auto-launch')
const { sendToMenubar } = require('./ipc')
const appLauncher = new AutoLaunch({ name: 'Galeri' })

// TODO: get autolaunch setting from config
// TODO: if is disabled then disable, else enable

appLauncher.isEnabled()
  .then(enabled => sendToMenubar('auto-launch', { enabled }))
  .catch(err => console.error(err))

ipcMain.on('preferences:set-auto-launch', (e, { enabled }) =>
  // TODO: store setting in config
  enabled ? appLauncher.enable() : appLauncher.disable())

appLauncher.enable()
