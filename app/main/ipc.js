const { ipcMain, BrowserWindow } = require('electron')

const sendToWindows = (msg, arg) => BrowserWindow.getAllWindows()
  .forEach(win => win.webContents.send(msg, arg))

const sendToBackground = (msg, arg) => BrowserWindow.getAllWindows()[0]
  .webContents.send(msg, arg)

const sendToMenubar = (msg, arg) => {
  const menubar = BrowserWindow.getAllWindows()[1]

  menubar && menubar.webContents.send(msg, arg)
}

// sent from taskbar window
ipcMain.on('next-image-request', (e, arg) =>
  sendToBackground('next-image-request', arg))

ipcMain.on('preferences.showDescriptionOnDesktop', (e, arg) =>
  sendToBackground('preferences.showDescriptionOnDesktop', arg))

ipcMain.on('preferences.refreshRate', (e, arg) =>
  sendToBackground('preferences.refreshRate', arg))

// sent from background window
ipcMain.on('next-image-done', (event, arg) =>
  sendToMenubar('next-image-done', arg))

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
