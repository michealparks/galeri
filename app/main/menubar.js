const {Tray, BrowserWindow, systemPreferences} = require('electron')
const {format} = require('url')
const {resolve} = require('path')
const positioner = require('./positioner')

let tray, win

const initMenubar = () => {
  tray = new Tray(getImage())
  tray.on('click', onClick)
  tray.on('double-click', onClick)
  createWindow()

  if (systemPreferences.subscribeNotification) {
    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      () => tray.setImage(getImage()))
  }
}

const createWindow = () => {
  win = new BrowserWindow({
    width: 250,
    height: 320,
    alwaysOnTop: __dev__,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    thickFrame: false,
    show: false,
    frame: false,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  if (__dev__) win.openDevTools({mode: 'detach'})

  win.setVisibleOnAllWorkspaces(true)
  win.setMenuBarVisibility(false)
  win.once('ready-to-show', win.show)
  win.on('blur', hideWindow)
  win.on('close', e => { win = undefined })
  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, '..', 'menubar/index.html')
  }))
}

const getImage = () => systemPreferences.isDarkMode()
  ? resolve(__dirname, '../../assets/icon-dark_32x32.png')
  : resolve(__dirname, '../../assets/icon_32x32.png')

const onClick = (e, bounds) => win.isVisible()
  ? hideWindow()
  : showWindow(bounds)

const hideWindow = () => {
  tray.setHighlightMode('never')
  win.hide()
}

const showWindow = (bounds) => {
  tray.setHighlightMode('always')

  if (win === undefined) createWindow()

  // Default the window to the right if `trayPos` bounds are undefined or null.
  let noBoundsPos
  if (bounds === undefined || bounds.x === 0) {
    noBoundsPos = __win32__ ? 'bottomRight' : 'topRight'
  }

  const winPos = __win32__ ? 'trayBottomCenter' : 'trayCenter'
  const [w, h] = win.getSize()
  const [left, top] = positioner(w, h, noBoundsPos || winPos, bounds)

  win.setPosition(left, top + (__win32__ ? 0 : 5))
  win.show()
}

module.exports = initMenubar
