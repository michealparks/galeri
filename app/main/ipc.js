const { ipcMain, BrowserWindow } = require('electron')

let tray

const ids = {
  background: null,
  menubar: null
}

function cacheTray (t) {
  tray = t
}

function cacheId (name, id) {
  ids[name] = id
}

function sendToWindows (msg, arg) {
  return BrowserWindow.getAllWindows().forEach(win =>
    win.webContents.send(msg, arg)
  )
}

function sendToBackground (msg, arg) {
  return BrowserWindow.fromId(ids.background).webContents.send(msg, arg)
}

function sendToMenubar (msg, arg) {
  return BrowserWindow.fromId(ids.menubar).webContents.send(msg, arg)
}

// preferences can only be toggled from menubar, so send to background
ipcMain.on('preferences', (e, arg) => sendToBackground('preferences', arg))
ipcMain.on('play', sendToBackground.bind(null, 'play'))
ipcMain.on('pause', sendToBackground.bind(null, 'pause'))
ipcMain.on('artwork', (e, arg) => {
  tray.setToolTip(`${arg.title}\n${arg.text}`)
  sendToMenubar('artwork', arg)
})

module.exports = {
  cacheTray,
  cacheId,
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
