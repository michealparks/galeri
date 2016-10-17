const { ipcMain, app } = require('electron')
const AutoLaunch = require('auto-launch')
const { log } = require('./log')
const { getConfig } = require('./app-config')

const appLauncher = new AutoLaunch({
  name: 'Galeri',
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: process.platform === 'darwin'
    ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
    : undefined // Use the default
})

let isEnabled

appLauncher.isEnabled().then(data => { isEnabled = data })

getConfig(config => {
  log('AUTOLAUNCH')
  log(config)
  if (config.enabled && !isEnabled) appLauncher.enable()
  if (!config.enabled && isEnabled) appLauncher.disable()

  isEnabled = config.enabled
})
