const { ipcMain, BrowserWindow } = require('electron')

function sendToWindows (msg, arg) {
  return BrowserWindow.getAllWindows().forEach(win =>
    win.webContents.send(msg, arg))
}

function sendToBackground (msg, arg) {
  return BrowserWindow.getAllWindows()[0].webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  return BrowserWindow.getAllWindows()[1].webContents.send(msg, arg)
}

// preferences can only be toggled from menubar, so send to background
ipcMain.on('preferences', (e, arg) =>
  sendToBackground('preferences', arg))

ipcMain.on('artwork', (e, arg) =>
  sendToMenubar('artwork', arg))

ipcMain.on('play', () => sendToBackground('play'))
ipcMain.on('pause', () => sendToBackground('pause'))

module.exports = {
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
