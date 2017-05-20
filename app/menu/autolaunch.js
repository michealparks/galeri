module.exports = {enable, disable, isEnabled}

const linux = process.platform === 'linux'
const win32 = process.platform === 'win32'
const fs = require('fs')
const path = require('path')
const home = require('os').homedir()
const electron = require('electron')
const mkdirp = require('../shared/mkdirp')
const appName = 'Galeri'
const filePath = `${getDirectory() + appName}.desktop`
const appPath = win32
  ? path.resolve(path.dirname(process.execPath), '..', 'Update.exe')
  : linux
  ? electron.remote.app.getPath('exe').split('.app/Content')[0] + '.app'
  : process.execPath

const startArgs = win32
  ? [
    '--processStart', `"${path.basename(process.execPath)}"`,
    '--process-start-args', `"--hidden"`
  ]
  : undefined

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
  if (!linux) return toggle(true)

  createFile({
    data: data(appName, appPath),
    directory: getDirectory(),
    filePath: filePath
  }, (err) => err && console.log(err))
}

function disable (next) {
  if (!linux) return toggle(false)

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
  if (linux) {
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
