const { ipcMain, BrowserWindow } = require('electron')

const sendToWindows = (msg, arg) => BrowserWindow.getAllWindows()
  .forEach(win => win.webContents.send(msg, arg))

const sendToBackground = (msg, arg) => BrowserWindow.getAllWindows()[0]
  .webContents.send(msg, arg)

const sendToMenubar = (msg, arg) => BrowserWindow.getAllWindows()[1]
  .webContents.send(msg, arg)

// preferences can only be toggled from menubar, so send to background
ipcMain.on('preferences', (e, arg) =>
  sendToBackground('preferences', arg))

// powerMonitor can only be called after app.ready() fires
const initIPC = () => {
  const { powerMonitor } = require('electron')

  powerMonitor.on('suspend', () => sendToWindows('suspend'))
  powerMonitor.on('resume', () => sendToWindows('resume'))
}

module.exports = {
  sendToWindows,
  sendToBackground,
  sendToMenubar,
  initIPC
}
