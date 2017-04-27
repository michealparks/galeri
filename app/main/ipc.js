const dev = process.env.NODE_ENV === 'development'
const electron = require('electron')
const ipc = electron.ipcMain
const getAllWindows = electron.BrowserWindow.getAllWindows
const getWindowFromId = electron.BrowserWindow.fromId

let aboutWindow, tray, menubarID, storedArtwork
let backgroundIDs = []

function cacheTray (t) {
  tray = t
}

function cacheId (name, id) {
  if (name === 'background') {
    backgroundIDs.push(id)
  }

  if (name === 'menubar') {
    menubarID = id
  }
}

function removeCachedId (id) {
  let newIds = []

  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    if (backgroundIDs[i] !== id) newIds.push(backgroundIDs[i])
  }

  backgroundIDs = newIds
}

function sendToWindows (msg, arg) {
  for (let i = 0, arr = getAllWindows(), l = arr.length; i < l; ++i) {
    arr[i].webContents.send(msg, arg)
  }
}

function sendToBackground (msg, arg) {
  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    getWindowFromId(backgroundIDs[i]).webContents.send(msg, arg)
  }
}

function sendToMenubar (msg, arg) {
  return getWindowFromId(menubarID).webContents.send(msg, arg)
}

ipc.on('play', function () {
  sendToBackground('play')
})

ipc.on('pause', function () {
  sendToBackground('pause')
})

ipc.on('preferences-to-background', function (e, data) {
  sendToBackground('preferences-to-background', data)
})

ipc.on('preferences-to-menubar', function (e, data) {
  sendToMenubar('preferences-to-menubar', data)
})

ipc.on('menubar-needs-preferences', function () {
  sendToBackground('menubar-needs-preferences')
})

ipc.on('artwork', function (e, artwork) {
  storedArtwork = artwork
  tray.setToolTip(`${artwork.title}\n${artwork.text}\n${artwork.source}`)
  sendToWindows('artwork', artwork)
})

ipc.on('artwork-updated', function () {
  sendToMenubar('artwork-updated')
})

ipc.on('background-loaded', function () {
  sendToMenubar('background-loaded')
})

ipc.on('background-clone-loaded', function () {
  if (storedArtwork) {
    sendToBackground('artwork-to-clone', storedArtwork)
  }
})

ipc.on('open-about-window', function () {
  aboutWindow = new electron.BrowserWindow({
    title: 'Galeri About',
    center: true,
    show: false,
    width: 400,
    height: 300,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  aboutWindow.once('ready-to-show', aboutWindow.show)

  aboutWindow.on('close', function () {
    aboutWindow = null
  })

  return aboutWindow.loadURL(require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: dev
      ? require('path').join(__dirname, '..', 'about.html')
      : require('path').join(__dirname, 'build', 'about.html')
  }))
})

module.exports = {
  cacheTray: cacheTray,
  cacheId: cacheId,
  removeCachedId: removeCachedId,
  sendToWindows: sendToWindows,
  sendToBackground: sendToBackground,
  sendToMenubar: sendToMenubar
}
