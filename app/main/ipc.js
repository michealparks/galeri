import electron, {ipcMain as ipc} from 'electron'
import openAbout from './about'

const {getAllWindows, fromId} = electron.BrowserWindow

let storedArt
let backgroundIDs = []
const channels = {}

const createIpcListener = (name) => {
  ipc.on(name, (e, arg) => {
    for (let i = 0, c = channels[name], l = c.length; i < l; ++i) {
      c[i](arg)
    }
  })
}

const toWindows = (msg, arg) => {
  for (let i = 0, arr = getAllWindows(), l = arr.length; i < l; ++i) {
    arr[i].webContents.send(msg, arg)
  }
}

const toBackgrounds = (msg, arg) => {
  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    fromId(backgroundIDs[i]).webContents.send(msg, arg)
  }
}

export const addListener = (name, fn) => {
  if (channels[name] === undefined) {
    channels[name] = []
    createIpcListener(name)
  }

  channels[name].push(fn)
}

export const cacheBrowserId = (id) => {
  backgroundIDs.push(id)
}

export const removeCachedBrowserId = (id) => {
  let newIds = []

  for (let i = 0, l = backgroundIDs.length; i < l; ++i) {
    if (backgroundIDs[i] !== id) newIds.push(backgroundIDs[i])
  }

  backgroundIDs = newIds
}

export const getArt = () => {
  return storedArt
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
