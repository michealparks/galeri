module.exports = initMenubar

const __dev__ = process.env.NODE_ENV === 'development'
const electron = require('electron')
const calculatePosition = require('./positioner')
const {getArt, addListener} = require('./ipc')
const {isArtFavorited} = require('./favorites')
const {getUrl} = require('./util')
const win32 = process.platform === 'win32'

const config = {
  alwaysOnTop: __dev__,
  resizable: false,
  transparent: true,
  skipTaskbar: true,
  hasShadow: false,
  thickFrame: false,
  show: false,
  frame: false,
  width: 250,
  height: 320,
  webPreferences: {
    webAudio: false,
    webgl: false
  }
}

let tray
let win

if (electron.systemPreferences.subscribeNotification !== undefined) {
  electron.systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => tray && tray.setImage(getImage()))
}

addListener('favorites:delete', (href) =>
  getArt().href === href && win.webContents.send('favorites:delete'))
addListener('background:artwork', (art) =>
  tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`))
addListener('background:is-paused', (paused) =>
  win && win.webContents.send('background:is-paused', paused))
addListener('background:label-location', (l) =>
  win && win.webContents.send('background:label-location', l))
addListener('background:update-rate', (rate) =>
  win && win.webContents.send('background:update-rate', rate))
addListener('menubar:loaded', () => {
  const art = getArt()
  art.isFavorited = isArtFavorited(art.href)
  win.webContents.send('background:artwork', art)
})

function getImage () {
  const icon = electron.systemPreferences.isDarkMode() ? 'icon-dark' : 'icon'
  return `${__dirname}/${__dev__ ? '../../' : ''}assets/${icon}_32x32.png`
}

function initMenubar () {
  tray = new electron.Tray(getImage())
  tray.on('click', onClick)
  tray.on('double-click', onClick)
}

function createWindow () {
  win = new electron.BrowserWindow(config)

  win.setVisibleOnAllWorkspaces(true)

  if (__dev__) win.openDevTools({ mode: 'detach' })

  win.once('ready-to-show', win.show)
  win.on('blur', () => !__dev__ && hideWindow())
  win.on('close', () => { win = undefined })

  return win.loadURL(getUrl('menubar'))
}

function onClick (e, bounds) {
  return win === undefined
    ? showWindow(bounds)
    : hideWindow()
}

function showWindow (bounds) {
  tray.setHighlightMode('always')
  createWindow()

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPosition
  if (bounds === undefined || bounds.x === 0) {
    noBoundsPosition = win32 ? 'bottomRight' : 'topRight'
  }

  const winPosition = win32 ? 'trayBottomCenter' : 'trayCenter'
  const position = calculatePosition(
    electron.screen,
    config.width,
    config.height,
    noBoundsPosition || winPosition,
    bounds)

  win.setPosition(position[0], position[1] + (win32 ? 0 : 5))
}

function hideWindow () {
  tray.setHighlightMode('never')
  win.close()
}
