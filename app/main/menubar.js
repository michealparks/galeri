import electron, {
  app,
  systemPreferences,
  BrowserWindow,
  Tray
} from 'electron'

import {
  APP_ICON,
  TRAY_ICON,
  TRAY_ICON_DARK
} from '../../config'

import calculatePosition from './positioner'
import initUpdater from './updater'
import {getArt, addListener} from './ipc'
import {isArtFavorited} from './favorites'
import {getUrl} from './util'

const opts = {
  title: '',
  icon: APP_ICON,
  alwaysOnTop: __dev__,
  resizable: false,
  transparent: true,
  skipTaskbar: !__linux__,
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

if (systemPreferences.subscribeNotification !== undefined) {
  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => tray && tray.setImage(getImage()))
}

if (!__linux__) {
  addListener('background:artwork', (art) =>
    tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`))
}

if (__linux__) {
  app.on('before-quit', () => {
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

const sendEvent = (e, data) => {
  return win !== undefined && win.webContents.send(e, data)
}

const getImage = () => {
  return systemPreferences.isDarkMode() || __linux__
    ? TRAY_ICON_DARK
    : TRAY_ICON
}

const createWindow = () => {
  if (win !== undefined) {
    return win.focus() && win.restore()
  }

  win = new BrowserWindow(opts)

  win.setVisibleOnAllWorkspaces(true)
  win.setMenuBarVisibility(false)

  if (__dev__) win.openDevTools({mode: 'detach'})

  win.once('ready-to-show', win.show)

  win.on('close', onClose)

  if (!__dev__ && !__linux__) {
    win.on('blur', hideWindow)
  }

  return win.loadURL(getUrl('menubar'))
}

const onClose = (e) => {
  if (__linux__) {
    e.preventDefault()
    win.minimize()
  } else {
    win = undefined
  }
}

const onClick = (e, bounds) => {
  return win.isVisible()
    ? hideWindow()
    : showWindow(bounds)
}

const showWindow = (bounds) => {
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

const hideWindow = () => {
  tray.setHighlightMode('never')
  win.hide()
}

export default () => {
  if (!__linux__) {
    tray = new Tray(getImage())
    tray.on('click', onClick)
    tray.on('double-click', onClick)
  }

  createWindow()
}
