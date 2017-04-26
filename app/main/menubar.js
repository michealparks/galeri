module.exports = initMenubar

const dev = process.env.NODE_ENV === 'development'
const electron = require('electron')
const calculatePosition = require('./positioner')
const ipcHandler = require('./ipc')
const win32 = process.platform === 'win32'

let tray, win, cachedBounds

electron.systemPreferences
.subscribeNotification('AppleInterfaceThemeChangedNotification', function () {
  if (tray) tray.setImage(getImage())
})

function getImage () {
  const icon = electron.systemPreferences.isDarkMode() ? 'icon-dark' : 'icon'

  return dev
    ? `${__dirname}/../../assets/${icon}_32x32.png`
    : `${__dirname}/assets/${icon}_32x32.png`
}

function initMenubar (next) {
  tray = new electron.Tray(getImage())

  tray.on('click', onClick)
  tray.on('double-click', onClick)

  ipcHandler.cacheTray(tray)

  tray.setHighlightMode('never')

  createWindow(next)
}

function createWindow (next) {
  win = new electron.BrowserWindow({
    title: 'Galeri Menu',
    dir: require('path').resolve(electron.app.getAppPath()),
    alwaysOnTop: dev,
    resizable: false,
    transparent: true,
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

  if (dev) win.openDevTools({ mode: 'detach' })

  ipcHandler.cacheId('menubar', win.id)

  win.setVisibleOnAllWorkspaces(true)

  win.on('blur', function () {
    return dev ? null : hideWindow()
  })

  win.on('close', function () {
    win = null
  })

  win.once('ready-to-show', next)

  return win.loadURL(dev
    ? `file://${__dirname}/../../app/menubar.html`
    : `file://${__dirname}/build/menubar.html`)
}

function onClick (e, bounds) {
  if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
    return hideWindow()
  }

  if (win && win.isVisible()) {
    return hideWindow()
  }

  cachedBounds = bounds || cachedBounds
  return showWindow(cachedBounds)
}

function showWindow (trayPos) {
  tray.setHighlightMode('always')

  if (!win) createWindow()

  if (trayPos && trayPos.x !== 0) {
    // Cache the bounds
    cachedBounds = trayPos
  } else if (cachedBounds) {
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
  return win ? win.hide() : null
}
