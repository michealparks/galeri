const dev = process.env.NODE_ENV === 'development'
const {ipcMain, BrowserWindow} = require('electron')
const {getAllWindows, fromId} = BrowserWindow

let aboutWin, favoritesWin, tray, menubarID, storedArtwork
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
    fromId(backgroundIDs[i]).webContents.send(msg, arg)
  }
}

function sendToMenubar (msg, arg) {
  return fromId(menubarID).webContents.send(msg, arg)
}

ipcMain.on('play', function () {
  sendToBackground('play')
})

ipcMain.on('pause', function () {
  sendToBackground('pause')
})

ipcMain.on('preferences-to-background', function (e, data) {
  sendToBackground('preferences-to-background', data)
})

ipcMain.on('preferences-to-menubar', function (e, data) {
  sendToMenubar('preferences-to-menubar', data)
})

ipcMain.on('menubar-needs-preferences', function () {
  sendToBackground('menubar-needs-preferences')
})

ipcMain.on('artwork', function (e, artwork) {
  storedArtwork = artwork
  tray.setToolTip(`${artwork.title}\n${artwork.text}\n${artwork.source}`)
  sendToWindows('artwork', artwork)
})

ipcMain.on('artwork-updated', function () {
  sendToMenubar('artwork-updated')
})

ipcMain.on('background-loaded', function () {
  sendToMenubar('background-loaded')
})

ipcMain.on('background-clone-loaded', function () {
  if (storedArtwork) {
    sendToBackground('artwork-to-clone', storedArtwork)
  }
})

ipcMain.on('open-favorites-window', function (name) {
  favoritesWin = new BrowserWindow({
    title: 'Galeri Favorites',
    center: true,
    show: false,
    width: 600,
    height: 500,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  favoritesWin.once('ready-to-show', favoritesWin.show)

  favoritesWin.on('close', function () {
    favoritesWin = null
  })

  favoritesWin.loadURL(require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: dev
      ? require('path').join(__dirname, '..', 'about.html')
      : require('path').join(__dirname, 'build', 'about.html')
  }))
})

ipcMain.on('open-about-window', function () {
  aboutWin = new BrowserWindow({
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

  aboutWin.once('ready-to-show', aboutWin.show)

  aboutWin.on('close', function () {
    aboutWin = null
  })

  return aboutWin.loadURL(require('url').format({
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
