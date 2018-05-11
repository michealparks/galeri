module.exports = initMenubar

const electron = require('electron')
const config = require('../../config')
const calculatePosition = require('./positioner')
const initUpdater = require('./updater')
const {getArt, addListener} = require('./ipc')
const {isArtFavorited} = require('./favorites')
const {getUrl} = require('./util')

const opts = {
  title: '',
  icon: config.APP_ICON,
  alwaysOnTop: __dev__,
  resizable: false,
  transparent: true,
  skipTaskbar: !__linux__,
  thickFrame: false,
  show: false,
  frame: __linux__,
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

if (!__linux__) {
  addListener('background:artwork', (art) =>
    tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`))
}

if (__linux__) {
  electron.app.on('before-quit', () => {
    if (win) win.destroy()
  })
}

addListener('favorites:delete', (href) =>
  getArt().href === href && sendEvent('favorites:delete'))

addListener('background:is-paused', (paused) =>
  sendEvent('background:is-paused', paused))

addListener('background:label-location', (l) =>
  sendEvent('background:label-location', l))

addListener('background:update-rate', (rate) =>
  sendEvent('background:update-rate', rate))

addListener('menubar:loaded', () => {
  const art = getArt()
  art.isFavorited = isArtFavorited(art.href)

  sendEvent('background:artwork', art)

  if (__linux__ && updateVersion !== undefined) {
    sendEvent('main:update-available', updateVersion)
  }
})

initUpdater().onUpdateAvailable((version) => {
  updateVersion = version
})

function sendEvent (e, data) {
  return win !== undefined && win.webContents.send(e, data)
}

function getImage () {
  return electron.systemPreferences.isDarkMode() || __linux__
    ? config.TRAY_ICON_DARK
    : config.TRAY_ICON
}

function initMenubar () {
  if (!__linux__) {
    tray = new electron.Tray(getImage())
    tray.on('click', onClick)
    tray.on('double-click', onClick)
  }

  createWindow()
}

function createWindow () {
  if (win !== undefined) {
    return win.focus() && win.restore()
  }

  win = new electron.BrowserWindow(opts)

  win.setVisibleOnAllWorkspaces(true)
  win.setMenuBarVisibility(false)

  if (__dev__) win.openDevTools({ mode: 'detach' })

  win.once('ready-to-show', win.show)

  win.on('close', onClose)

  if (!__dev__ && !__linux__) {
    win.on('blur', hideWindow)
  }

  return win.loadURL(getUrl('menubar'))
}

function onClose (e) {
  if (__linux__) {
    e.preventDefault()
    win.minimize()
  } else {
    win = undefined
  }
}

function onClick (e, bounds) {
  return win.isVisible()
    ? hideWindow()
    : showWindow(bounds)
}

function showWindow (bounds) {
  tray.setHighlightMode('always')

  if (win === undefined) createWindow()

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPosition
  if (bounds === undefined || bounds.x === 0) {
    noBoundsPosition = __win32__ ? 'bottomRight' : 'topRight'
  }

  const winPosition = __win32__ ? 'trayBottomCenter' : 'trayCenter'
  const position = calculatePosition(
    electron.screen,
    opts.width,
    opts.height,
    noBoundsPosition || winPosition,
    bounds)

  win.setPosition(position[0], position[1] + (__win32__ ? 0 : 5))
  win.show()
}

function hideWindow () {
  tray.setHighlightMode('never')
  win.hide()
}
