console.time('init')

require('./app/main/crash-reporter')

const electron = require('electron')
const { cacheId, sendToWindows } = require('./app/main/ipc')
const { app, BrowserWindow, ipcMain } = electron
const delayedInitTime = 3000

let screen
let menubarWindow
let backgroundWindow = []

// Handle restart due to windows updates
let shouldQuit
if (process.platform === 'win32') {
  shouldQuit = require('./app/main/squirrel-win32')(process.argv[1])
}

// Handle possible other instances of the app
if (!shouldQuit) {
  shouldQuit = app.makeSingleInstance(function () {
  // Someone tried to run a second instance, we should focus our window.
    if (backgroundWindow[0]) {
      if (backgroundWindow[0].isMinimized()) backgroundWindow[0].restore()
      backgroundWindow[0].focus()
    }
  })

  if (shouldQuit) app.quit()
}

if (!shouldQuit) init()

function init () {
  require('./app/main/updater')

  app.commandLine.appendSwitch('disable-http-cache')

  menubarWindow = require('./app/main/menubar')

  app.once('ready', onReady)

  ipcMain.on('browser-reset', makeBackgroundWindow)
  ipcMain.on('browser-rendered', onBrowserRender)

  if (process.platform !== 'darwin') {
    app.once('window-all-closed', app.quit)
  }
}

function onReady () {
  screen = electron.screen

  screen.on('display-metrics-changed', function () {
    return setTimeout(resizeBackgrounds)
  })

  menubarWindow.once('ready', function () {
    if (process.env.NODE_ENV === 'development') {
      menubarWindow.window.openDevTools({ mode: 'detach' })
    }

    makeBackgroundWindow()
  })

  menubarWindow.init()
  electron.powerMonitor.on('suspend', sendToWindows.bind(null, 'suspend'))
  electron.powerMonitor.on('resume', sendToWindows.bind(null, 'resume'))

  // To keep app startup fast, some non-essential code is delayed.
  return setTimeout(onDelayedStartup, delayedInitTime)
}

function onDelayedStartup () {
  require('./app/main/autolaunch')
}

function onBrowserRender () {
  if (backgroundWindow.length === 1) {
    console.timeEnd('init')
  } else {
    return setTimeout(onBrowserDestroyReady, 4000)
  }
}

function onBrowserDestroyReady () {
  backgroundWindow[0].destroy()
  backgroundWindow[0] = null
  return backgroundWindow.shift()
}

function makeBackgroundWindow () {
  const { width, height } = screen.getPrimaryDisplay().size

  let win = new BrowserWindow({
    x: 0,
    y: 0,
    width: width,
    height: height + 5,
    type: 'desktop',
    resizable: false,
    title: 'Galeri',
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    frame: false,
    transparent: true,
    enableLargerThanScreen: true,
    webAudio: false,
    webgl: false
  })

  cacheId('background', win.id)

  win.setVisibleOnAllWorkspaces(true)
  win.once('ready-to-show', win.showInactive)
  win.once('closed', function () { win = null })
  win.loadURL(`file://${__dirname}/core/public/index.html`)

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  backgroundWindow.push(win)
}

function resizeBackgrounds () {
  const { width, height } = screen.getPrimaryDisplay().size

  return backgroundWindow.forEach(function (win) {
    win.setPosition(0, 0)
    win.setSize(width, height)
  })
}
