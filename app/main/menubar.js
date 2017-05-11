module.exports = initMenubar

const __dev__ = process.env.NODE_ENV === 'development'
const {format} = require('url')
const {resolve} = require('path')
const electron = require('electron')
const {systemPreferences, Tray} = require('electron')
const calculatePosition = require('./positioner')
const ipcHandler = require('./ipc')
const win32 = process.platform === 'win32'

let tray, win, cachedBounds

if ('subscribeNotification' in systemPreferences) {
  systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification',
    () => tray && tray.setImage(getImage()))
}

function getImage () {
  const icon = systemPreferences.isDarkMode() ? 'icon-dark' : 'icon'
  return `${__dirname}/${__dev__ ? '../../' : ''}assets/${icon}_32x32.png`
}

function initMenubar (next) {
  tray = new Tray(getImage())

  tray.on('click', onClick)
  tray.on('double-click', onClick)

  ipcHandler.cacheTray(tray)

  tray.setHighlightMode('never')

  createWindow(next)
}

function createWindow (next) {
  win = new electron.BrowserWindow({
    alwaysOnTop: __dev__,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    show: false,
    frame: false,
    width: 250,
    height: 320,
    webPreferences: {
      webAudio: false,
      webgl: false,
      backgroundThrottling: false
    }
  })

  ipcHandler.cacheId('menubar', win.id)

  win.setVisibleOnAllWorkspaces(true)

  if (__dev__) win.openDevTools({ mode: 'detach' })

  win.on('blur', () => __dev__ ? undefined : hideWindow())
  win.on('close', () => { win = undefined })
  win.once('ready-to-show', next)

  return win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, __dev__ ? '../../app' : 'build', 'menubar.html')
  }))
}

function onClick (e, bounds) {
  if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
    return hideWindow()
  }

  if (win !== undefined && win.isVisible()) {
    return hideWindow()
  }

  cachedBounds = bounds || cachedBounds
  return showWindow(cachedBounds)
}

function showWindow (trayPos) {
  tray.setHighlightMode('always')

  if (win === undefined) createWindow()

  if (trayPos && trayPos.x !== 0) {
    // Cache the bounds
    cachedBounds = trayPos
  } else if (cachedBounds !== undefined) {
    // Cached value will be used if showWindow is called without bounds data
    trayPos = cachedBounds
  } else if (tray.getBounds) {
    // Get the current tray bounds
    trayPos = tray.getBounds()
  }

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPosition

  if (trayPos === undefined || trayPos.x === 0) {
    noBoundsPosition = win32 ? 'bottomRight' : 'topRight'
  }

  const winPosition = win32 ? 'trayBottomCenter' : 'trayCenter'
  const position = calculatePosition(electron.screen, win, noBoundsPosition || winPosition, trayPos)

  win.setPosition(position[0], position[1] + (win32 ? 0 : 5))

  return win.show()
}

function hideWindow () {
  tray.setHighlightMode('never')
  return win !== undefined && win.hide()
}
