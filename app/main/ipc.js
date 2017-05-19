module.exports = {cacheId, removeCachedId, getArt, addListener}

const electron = require('electron')
const openAbout = require('./about')
const {getAllWindows, fromId} = electron.BrowserWindow
const ipc = electron.ipcMain

let storedArt
let backgroundIDs = []
const channels = {}

function addListener (name, fn) {
  if (channels[name] === undefined) {
    channels[name] = []
    createIpcListener(name)
  }

  channels[name].push(fn)
}

function createIpcListener (name) {
  ipc.on(name, (e, arg) => {
    for (let i = 0, c = channels[name], l = c.length; i < l; ++i) {
      c[i](arg)
    }
  })
}

function cacheId (id) {
  backgroundIDs.push(id)
}

function removeCachedId (id) {
  let newIds = []

  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    if (backgroundIDs[i] !== id) newIds.push(backgroundIDs[i])
  }

  backgroundIDs = newIds
}

function getArt () {
  return storedArt
}

function toWindows (msg, arg) {
  for (let i = 0, arr = getAllWindows(), l = arr.length; i < l; ++i) {
    arr[i].webContents.send(msg, arg)
  }
}

function toBackgrounds (msg, arg) {
  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    fromId(backgroundIDs[i]).webContents.send(msg, arg)
  }
}

electron.app.once('ready', () => {
  electron.powerMonitor.on('suspend', () => toWindows('main:suspend'))
  electron.powerMonitor.on('resume', () => toWindows('main:resume'))
})

// Menubar events
addListener('menubar:is-paused', (paused) =>
  toBackgrounds('menubar:is-paused', paused))
addListener('menubar:label-location', (l) =>
  toBackgrounds('menubar:label-location', l))
addListener('menubar:update-rate', (rate) =>
  toBackgrounds('menubar:update-rate', rate))
addListener('menubar:loaded', () =>
  toBackgrounds('menubar:loaded'))
addListener('open-about-window', () =>
  openAbout())

// Background events
addListener('background:artwork', (artwork) => {
  storedArt = artwork
  toWindows('background:artwork', storedArt)
})

// Clone events
addListener('clone:loaded', () =>
  storedArt && toBackgrounds('main:artwork', storedArt))
