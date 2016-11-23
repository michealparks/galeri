const { ipcMain, BrowserWindow } = require('electron')
const { getAllWindows, fromId } = BrowserWindow

let tray, backgroundID, menubarID

function cacheTray (t) {
  tray = t
}

function cacheId (name, id) {
  if (name === 'background') backgroundID = id
  if (name === 'menubar') menubarID = id
}

function sendToWindows (msg, arg) {
  for (let i = 0, arr = getAllWindows(), l = arr.length; i < l; ++i) {
    arr[i].webContents.send(msg, arg)
  }
}

function sendToBackground (msg, arg) {
  return fromId(backgroundID).webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  return fromId(menubarID).webContents.send(msg, arg)
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
