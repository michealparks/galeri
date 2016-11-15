const { resolve } = require('path')
const events = require('events')
const electron = require('electron')
const Positioner = require('./positioner')
const { cacheId, cacheTray } = require('./ipc')
const menubar = new events.EventEmitter()
const opts = {
  dir: resolve(electron.app.getAppPath()),
  resizable: false,
  alwaysOnTop: process.env.NODE_ENV === 'development',
  windowPosition: (process.platform === 'win32') ? 'trayBottomCenter' : 'trayCenter',
  transparent: true,
  show: false,
  frame: false,
  width: 250,
  height: 320,
  y: 30
}

let cachedBounds // cachedBounds are needed for double-clicked event
let supportsTrayHighlightState = false

menubar.init = appReady

function appReady () {
  if (process.platform !== 'win32') electron.app.dock.hide()

  menubar.tray = new electron.Tray(process.env.NODE_ENV === 'production'
    ? `${__dirname}/assets/icon_32x32.png`
    : `${__dirname}/../../assets/icon_32x32.png`)
  menubar.tray.on('click', clicked)
  menubar.tray.on('double-click', clicked)

  cacheTray(menubar.tray)

  try {
    menubar.tray.setHighlightMode('never')
    supportsTrayHighlightState = true
  } catch (e) {}

  createWindow()

  return menubar.emit('ready')
}

function createWindow () {
  menubar.emit('create-window')

  menubar.window = new electron.BrowserWindow(opts)
  menubar.positioner = new Positioner(menubar.window)

  cacheId('menubar', menubar.window.id)

  menubar.window.on('blur', () => opts.alwaysOnTop
    ? menubar.emit('focus-lost')
    : hideWindow())

  menubar.window.setVisibleOnAllWorkspaces(true)

  menubar.window.on('close', function () {
    delete menubar.window
    return menubar.emit('after-close')
  })

  menubar.window.loadURL(process.env.NODE_ENV === 'production'
    ? `file://${__dirname}/app/menubar.html`
    : `file://${__dirname}/../../app/menubar.html`)
}

function clicked (e, bounds) {
  if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return hideWindow()
  if (menubar.window && menubar.window.isVisible()) return hideWindow()
  cachedBounds = bounds || cachedBounds
  showWindow(cachedBounds)
}

function showWindow (trayPos) {
  if (supportsTrayHighlightState) menubar.tray.setHighlightMode('always')
  if (!menubar.window) createWindow()

  menubar.emit('show')

  if (trayPos && trayPos.x !== 0) {
    // Cache the bounds
    cachedBounds = trayPos
  } else if (cachedBounds) {
    // Cached value will be used if showWindow is called without bounds data
    trayPos = cachedBounds
  } else if (menubar.tray.getBounds) {
    // Get the current tray bounds
    trayPos = menubar.tray.getBounds()
  }

  // Default the window to the right if `trayPos` bounds are undefined or null.
  var noBoundsPosition = null
  if ((trayPos === undefined || trayPos.x === 0) && opts.windowPosition.substr(0, 4) === 'tray') {
    noBoundsPosition = (process.platform === 'win32') ? 'bottomRight' : 'topRight'
  }

  var position = menubar.positioner.calculate(noBoundsPosition || opts.windowPosition, trayPos)

  var x = (opts.x !== undefined) ? opts.x : position.x
  var y = (opts.y !== undefined) ? opts.y : position.y

  menubar.window.setPosition(x, y)
  menubar.window.show()
  return menubar.emit('after-show')
}

function hideWindow () {
  if (supportsTrayHighlightState) menubar.tray.setHighlightMode('never')
  if (!menubar.window) return
  menubar.emit('hide')
  menubar.window.hide()
  return menubar.emit('after-hide')
}

module.exports = menubar
