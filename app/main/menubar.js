module.exports = initMenubar

const __dev__ = process.env.NODE_ENV === 'development'
const electron = require('electron')
const config = require('../../config')
const calculatePosition = require('./positioner')
const initUpdater = require('./updater')
const {getArt, addListener} = require('./ipc')
const {isArtFavorited} = require('./favorites')
const {getUrl} = require('./util')
const win32 = process.platform === 'win32'
const linux = process.platform === 'linux'

const winConfig = {
  title: 'Galeri Menu',
  icon: config.APP_ICON,
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
let updateVersion

if (electron.systemPreferences.subscribeNotification !== undefined) {
  electron.systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => tray && tray.setImage(getImage()))
}

if (!linux) {
  addListener('background:artwork', (art) =>
    tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`))
}

addListener('favorites:delete', (href) =>
  getArt().href === href && win.webContents.send('favorites:delete'))
addListener('background:is-paused', (paused) =>
  win !== undefined &&
  win.webContents.send('background:is-paused', paused))
addListener('background:label-location', (l) =>
  win !== undefined &&
  win.webContents.send('background:label-location', l))
addListener('background:update-rate', (rate) =>
  win !== undefined &&
  win.webContents.send('background:update-rate', rate))
addListener('menubar:loaded', () => {
  const art = getArt()
  art.isFavorited = isArtFavorited(art.href)
  win.webContents.send('background:artwork', art)

  if (linux && updateVersion !== undefined) {
    win.webContents.send('main:update-available', updateVersion)
  }
})

initUpdater().onUpdateAvailable((version) => {
  updateVersion = version
})

function getImage () {
  return electron.systemPreferences.isDarkMode() || linux
    ? config.TRAY_ICON_DARK
    : config.TRAY_ICON
}

function initMenubar () {
  tray = new electron.Tray(getImage())
  tray.on('click', onClick)
  tray.on('double-click', onClick)

  if (linux) {
    tray.setContextMenu(electron.Menu.buildFromTemplate([
      {
        label: 'Menu',
        click: e => onClick(
          e,
          electron.screen.getCursorScreenPoint())
      }, {
        label: 'Quit',
        click: electron.app.quit
      }
    ]))
  }
}

function createWindow () {
  win = new electron.BrowserWindow(winConfig)

  win.setVisibleOnAllWorkspaces(true)

  if (__dev__) win.openDevTools({ mode: 'detach' })

  win.once('ready-to-show', win.show)
  win.on('close', onClose)
  if (!__dev__) win.on('blur', hideWindow)

  return win.loadURL(getUrl('menubar'))
}

function onClose () {
  win = undefined
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
    winConfig.width,
    winConfig.height,
    noBoundsPosition || winPosition,
    bounds)

  win.setPosition(position[0], position[1] + (win32 ? 0 : 5))
}

function hideWindow () {
  tray.setHighlightMode('never')
  win.close()
}
