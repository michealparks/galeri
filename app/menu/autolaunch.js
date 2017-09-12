module.exports = {enable, disable, isEnabled}

const fs = require('fs')
const path = require('path')
const home = require('os').homedir()
const electron = require('electron')
const mkdirp = require('../shared/mkdirp')
const appName = 'Galeri'
const filePath = `${getDirectory() + appName}.desktop`

let appPath
let startArgs

if (__win32__) {
  appPath = path.resolve(path.dirname(process.execPath), '..', 'Update.exe')
  startArgs = [
    '--processStart', `"${path.basename(process.execPath)}"`,
    '--process-start-args', `"--hidden"`
  ]
} else if (__linux__) {
  appPath = electron.remote.app.getPath('exe').split('.app/Content')[0] + '.app'
} else {
  appPath = process.execPath
}

const data = (appName, appPath) => `
[Desktop Entry]
Type=Application
Version=1.0
Name=${appName}
Comment=${appName} startup script
Exec=${appPath}
StartupNotify=false
Terminal=false
`

function enable () {
  if (!__linux__) return toggle(true)

  createFile({
    data: data(appName, appPath),
    directory: getDirectory(),
    filePath: filePath
  }, (err) => err && console.log(err))
}

function disable (next) {
  if (!__linux__) return toggle(false)

  fs.stat(filePath, (statErr) => statErr
    ? next && next(statErr)
    : fs.unlink(filePath, (unlinkErr) => unlinkErr
      ? next && next(unlinkErr)
      : next && next()))
}

function toggle (isEnabled) {
  electron.remote.app.setLoginItemSettings({
    openAtLogin: isEnabled,
    path: appPath,
    args: startArgs
  }, appPath, startArgs)
}

function isEnabled (next) {
  if (__linux__) {
    return fs.stat(filePath, (err, stat) => err
      ? next(false)
      : next(stat !== null && stat !== undefined))
  } else {
    next(electron.remote.app.getLoginItemSettings({
      path: appPath
    }).openAtLogin)
  }
}

function getDirectory () {
  const str = '~/.config/autostart/'
  return home ? str.replace(/^~($|\/|\\)/, `${home}$1`) : str
}

function createFile (arg, next) {
  mkdirp(arg.directory, (mkdirErr) => mkdirErr
    ? next(mkdirErr)
    : fs.writeFile(arg.filePath, arg.data, next))
}
