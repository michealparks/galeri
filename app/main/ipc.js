const { ipcMain, BrowserWindow } = require('electron')

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
  return sendToBackground('preferences', data)
})

ipcMain.on('cached-preferences', function (e, data) {
  return sendToMenubar('cached-preferences', data)
})

ipcMain.on('artwork', function (e, arg) {
  tray.setToolTip(`${arg.title}\n${arg.text}\n${arg.source}`)
  return sendToMenubar('artwork', arg)
})

ipcMain.on('artwork-updated', function () {
  return sendToMenubar('artwork-updated')
})

module.exports = {
  cacheTray,
  cacheId,
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
