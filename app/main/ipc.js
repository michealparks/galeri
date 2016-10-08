const { ipcMain, BrowserWindow } = require('electron')

function sendToWindows (msg, arg) {
  BrowserWindow.getAllWindows().forEach(function (win) {
    win.webContents.send(msg, arg)
  })
}

function sendToBackground (msg, arg) {
  BrowserWindow.getAllWindows()[0].webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  BrowserWindow.getAllWindows()[1].webContents.send(msg, arg)
}

// preferences can only be toggled from menubar, so send to background
ipcMain.on('preferences', function (e, arg) {
  sendToBackground('preferences', arg)
})

module.exports = {
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
