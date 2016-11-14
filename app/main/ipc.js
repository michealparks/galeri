const config = require('application-config')('Galeri')
const { ipcMain, BrowserWindow } = require('electron')
const { minutes } = require('../util/time')

const ids = {
  background: null,
  menubar: null
}

let tray

function cacheTray (t) {
  tray = t
}

function cacheId (name, id) {
  ids[name] = id
}

function sendToWindows (msg, arg) {
  return BrowserWindow.getAllWindows().forEach(function (win) {
    return win.webContents.send(msg, arg)
  })
}

function sendToBackground (msg, arg) {
  return BrowserWindow.fromId(ids.background).webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  return BrowserWindow.fromId(ids.menubar).webContents.send(msg, arg)
}

ipcMain.on('play', function () {
  return sendToBackground('play')
})

ipcMain.on('pause', function () {
  return sendToBackground('pause')
})

ipcMain.on('preferences', function (e, data) {
  sendToBackground('preferences', data)
  return config.write(data)
})

ipcMain.on('artwork', function (e, arg) {
  tray.setToolTip(`${arg.title}\n${arg.text}\n${arg.source}`)
  return sendToMenubar('artwork', arg)
})

ipcMain.on('artwork-updated', function () {
  return sendToMenubar('artwork-updated')
})

config.read(function (err, data) {
  if (!err && data && Object.keys(data).length > 0 && data.version) return

  return config.write({
    version: 'v0.0.3',
    refreshRate: minutes(30),
    showTextOnDesktop: true,
    autolaunch: true
  })
})

module.exports = {
  cacheTray,
  cacheId,
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
