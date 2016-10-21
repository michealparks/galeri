console.time('init')

require('./app/main/crash-reporter').init()

const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const delayedInitTime = 3000
let menubarWindow
let backgroundWindow = []

// Handle restart due to windows updates
let shouldQuit
if (process.platform === 'win32') {
  shouldQuit = require('./app/main/squirrel-win32')(process.argv[1])
}

// Handle possible other instances of the app
if (!shouldQuit) {
  shouldQuit = app.makeSingleInstance(() => {
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
  app.commandLine.appendSwitch('disable-http-cache')

  menubarWindow = require('./app/main/menubar')

  app.on('ready', onReady)

  ipcMain.on('browser-reset', init)
  ipcMain.on('browser-rendered', onBrowserRender)

  if (process.platform !== 'darwin') {
    app.on('window-all-closed', app.quit)
  }

  if (process.env.NODE_ENV === 'development') {
    menubarWindow.on('after-create-window', () =>
      menubarWindow.window.openDevTools({ mode: 'detach' }))
  }
}

function onReady () {
  makeBackgroundWindow()

  const ipc = require('./app/main/ipc')

  ipc.init()

  electron.powerMonitor.on('suspend', ipc.sendToWindows.bind(null, 'suspend'))
  electron.powerMonitor.on('resume', ipc.sendToWindows.bind(null, 'resume'))

  // To keep app startup fast, some non-essential code is delayed.
  return setTimeout(onDelayedStartup, delayedInitTime)
}

function onDelayedStartup () {
  require('./app/main/app-config')
  require('./app/main/autolaunch')
  require('./app/main/updater').init()
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
  const { width, height } = electron.screen.getPrimaryDisplay().size

  let win = new BrowserWindow({
    x: -10,
    y: -10,
    width: width + 20,
    height: height + 20,
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
    enableLargerThanScreen: true
  })

  win.once('ready-to-show', win.showInactive)
  win.on('closed', () => { win = null })
  win.loadURL(`file://${__dirname}/app/background.html`)

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  backgroundWindow.push(win)
}
