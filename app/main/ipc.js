module.exports = {cacheTray, cacheId, removeCachedId}

const electron = require('electron')
const config = require('application-config')('Galeri Favorites')
const {openFavorites, openAbout} = require('./windows')
const {makeThumb, removeThumb} = require('./thumb')
const launcher = require('./autolaunch')
const {getAllWindows, fromId} = electron.BrowserWindow
const ipc = electron.ipcMain

let tray, menubarID, favoritesId, storedArt

let favorites = []
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

function toWindows (msg, arg) {
  for (let i = 0, arr = getAllWindows(), l = arr.length; i < l; ++i) {
    arr[i].webContents.send(msg, arg)
  }
}

function toBackground (msg, arg) {
  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    fromId(backgroundIDs[i]).webContents.send(msg, arg)
  }
}

function toMenubar (msg, arg) {
  fromId(menubarID).webContents.send(msg, arg)
}

function toFavorites (msg, arg) {
  const win = favoritesId && fromId(favoritesId)
  if (win) win.webContents.send(msg, arg)
}

function onFavoriteChange (isFavorited, item) {
  if (isFavorited) {
    favorites.push(item)
    makeThumb(
      `${item.title} - ${item.text} - ${item.source}`, item.img,
      (err, d) => {
        if (err) return console.error(err)
        toFavorites('main:favorites', favorites)
      })
  } else {
    let found

    favorites = favorites.filter(f => {
      if (f.href === item.href) found = f
      return f.href !== item.href
    })

    if (found) {
      removeThumb(`${found.title} - ${found.text} - ${found.source}`)
      toFavorites('main:favorites', favorites)
    }
  }

  config.write({ favorites }, () => {})
}

function hasSameHref (item) {
  return item.href === storedArt.href
}

electron.app.once('ready', () => {
  electron.powerMonitor.on('suspend', () =>
    toWindows('main:suspend'))
  electron.powerMonitor.on('resume', () =>
    toWindows('main:resume'))
})

config.read((err, data) => {
  if (err) return
  favorites = data.favorites || []
})

launcher.isEnabled().then(isEnabled =>
  setTimeout(() =>
    toMenubar('main:is-autolaunch-enabled', isEnabled), 3000))

// Menubar events
ipc.on('menubar:get-settings', () =>
  toBackground('menubar:get-settings'))
ipc.on('menubar:is-autolaunch-enabled', (e, isEnabled) =>
  isEnabled ? launcher.enable() : launcher.disable())
ipc.on('menubar:is-paused', (e, paused) =>
  toBackground('menubar:is-paused', paused))
ipc.on('menubar:label-location', (e, l) =>
  toBackground('menubar:label-location', l))
ipc.on('menubar:update-rate', (e, rate) =>
  toBackground('menubar:update-rate', rate))
ipc.on('menubar:is-favorited', (e, isFavorited) =>
  onFavoriteChange(isFavorited, storedArt))
ipc.on('open-about-window', () =>
  openAbout())
ipc.on('open-favorites-window', () => {
  favoritesId = openFavorites()
})

// Background events
ipc.on('background:is-paused', (e, paused) =>
  toMenubar('background:is-paused', paused))
ipc.on('background:label-location', (e, l) =>
  toMenubar('background:label-location', l))
ipc.on('background:update-rate', (e, rate) =>
  toMenubar('background:update-rate', rate))
ipc.on('background:updated', () =>
  toMenubar('background:updated'))
ipc.on('background:loaded', () =>
  toMenubar('background:loaded'))
ipc.on('background:artwork', (e, artwork) => {
  storedArt = artwork
  tray.setToolTip(`${artwork.title}\n${artwork.text}\n${artwork.source}`)
  toWindows('background:artwork', artwork)
  toMenubar('main:is-favorited', favorites
    .findIndex(favorite => favorite.href === storedArt.href) > -1)
})

// Clone events
ipc.on('clone:loaded', () =>
  storedArt && toBackground('main:artwork', storedArt))

// Favorites events
ipc.on('favorites:loaded', () =>
  toFavorites('main:favorites', favorites))
ipc.on('favorites:delete', (e, href) => {
  onFavoriteChange(false, { href })
  toMenubar('main:is-favorited', favorites.findIndex(hasSameHref) > -1)
})
