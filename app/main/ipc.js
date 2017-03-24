const dev = process.env.NODE_ENV === 'development'
const { ipcMain, BrowserWindow } = require('electron')
const { getAllWindows, fromId } = BrowserWindow

let aboutWin, tray, backgroundID, menubarID

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

ipcMain.on('preferences-to-background', function (e, data) {
  return sendToBackground('preferences-to-background', data)
})

ipcMain.on('preferences-to-menubar', function (e, data) {
  return sendToMenubar('preferences-to-menubar', data)
})

ipcMain.on('menubar-needs-preferences', function () {
  return sendToBackground('menubar-needs-preferences')
})

ipcMain.on('artwork', function (e, arg) {
  tray.setToolTip(`${arg.title}\n${arg.text}\n${arg.source}`)
  return sendToMenubar('artwork', arg)
})

ipcMain.on('artwork-updated', function () {
  return sendToMenubar('artwork-updated')
})

ipcMain.on('background-loaded', function () {
  return sendToMenubar('background-loaded')
})

ipcMain.on('open-about-window', function () {
  aboutWin = new BrowserWindow({
    center: true,
    show: false,
    width: 400,
    height: 300,
    resizable: false,
    title: 'Galeri',
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  aboutWin.once('ready-to-show', aboutWin.show)

  aboutWin.on('close', function () {
    aboutWin = null
  })

  return aboutWin.loadURL(require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: dev
      ? require('path').join(__dirname, '..', 'about.html')
      : require('path').join(__dirname, 'app', 'about.html')
  }))
})

module.exports = {
  cacheTray,
  cacheId,
  sendToWindows,
  sendToBackground,
  sendToMenubar
}
