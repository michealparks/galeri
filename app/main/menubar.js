const electron = require('electron')
const { systemPreferences } = electron
const Positioner = require('./positioner')
const { cacheId, cacheTray } = require('./ipc')

const win32 = process.platform === 'win32'
const dev = process.env.NODE_ENV === 'development'

let icon, tray, win, positioner, cachedBounds

systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', function () {
  getIconColor()

  if (!tray) return

  tray.setImage(getImage())
})

function getIconColor () {
  icon = systemPreferences.isDarkMode() ? 'icon-dark' : 'icon'
}

function getImage () {
  return dev
    ? `${__dirname}/../../assets/${icon}_32x32.png`
    : `${__dirname}/assets/${icon}_32x32.png`
}

function initMenubar (next) {
  getIconColor()

  tray = new electron.Tray(getImage())

  tray.on('click', onClick)
  tray.on('double-click', onClick)

  cacheTray(tray)

  tray.setHighlightMode('never')

  createWindow(next)
}

function createWindow (next) {
  win = new electron.BrowserWindow({
    dir: require('path').resolve(electron.app.getAppPath()),
    alwaysOnTop: dev,
    resizable: false,
    transparent: true,
    show: false,
    frame: false,
    width: 250,
    height: 320
  })

  if (dev) win.openDevTools({ mode: 'detach' })

  positioner = new Positioner(win)

  cacheId('menubar', win.id)

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
    : `file://${__dirname}/app/menubar.html`)
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
  let noBoundsPosition = null
  if ((trayPos === undefined || trayPos.x === 0)) {
    noBoundsPosition = win32 ? 'bottomRight' : 'topRight'
  }

  const winPosition = win32 ? 'trayBottomCenter' : 'trayCenter'
  const position = positioner.calculate(noBoundsPosition || winPosition, trayPos)

  win.setPosition(position.x, position.y + (win32 ? 0 : 5))
  return win.show()
}

function hideWindow () {
  tray.setHighlightMode('never')
  return win ? win.hide() : null
}

module.exports = initMenubar
