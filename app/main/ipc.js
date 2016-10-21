const { ipcMain, BrowserWindow } = require('electron')

let windows

function init () {
  windows = BrowserWindow.getAllWindows()
}

function sendToWindows (msg, arg) {
  windows[0].webContents.send(msg, arg)
  windows[1].webContents.send(msg, arg)
}

function sendToBackground (msg, arg) {
  windows[0].webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  windows[1].webContents.send(msg, arg)
}

// preferences can only be toggled from menubar, so send to background
ipcMain.on('preferences', (e, arg) =>
  sendToBackground('preferences', arg))

ipcMain.on('artwork', (e, arg) =>
  sendToMenubar('artwork', arg))

ipcMain.on('play', sendToBackground.bind(null, 'play'))
ipcMain.on('pause', sendToBackground.bind(null, 'pause'))

module.exports = {
  init,
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
