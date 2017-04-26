const dev = process.env.NODE_ENV === 'development'

if (dev) console.time('init')

require('./app/main/crash-reporter')

const electron = require('electron')
const ipcHandler = require('./app/main/ipc')
const handleSession = require('./app/main/session')
const app = electron.app
const backgroundUrl = dev
  ? `file://${__dirname}/core/public/index.html`
  : `file://${__dirname}/build/index.html`
const backgroundCloneUrl = dev
  ? `file://${__dirname}/app/bg-clone.html`
  : `file://${__dirname}/build/bg-clone.html`
const darwin = process.platform === 'darwin'

let screen, initMenubar, lastWinId, currentWinId
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
  initMenubar = require('./app/main/menubar')

  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('js-flags', '--max_old_space_size=256 --use_strict --optimize_for_size')
  if (darwin) app.dock.hide()
  app.once('ready', onReady)

  electron.ipcMain.on('browser-reset', onBrowserReset)
  electron.ipcMain.on('browser-rendered', onBrowserRendered)

  if (process.platform !== 'darwin') {
    app.once('window-all-closed', app.quit)
  }
}

function onReady () {
  screen = electron.screen
  screen.on('display-metrics-changed', resizeBackgrounds)
  screen.on('display-added', onDisplayAdded)
  screen.on('display-removed', onDisplayRemoved)
  electron.powerMonitor.on('suspend', onSuspend)
  electron.powerMonitor.on('resume', onResume)

  initMenubar(function () {
    const primary = screen.getPrimaryDisplay()
    const secondary = screen.getAllDisplays()

    for (let i = 0, l = secondary.length; i < l; ++i) {
      if (secondary[i].id === primary.id) continue

      makeBackgroundWindow('clone', secondary[i])
    }

    makeBackgroundWindow('background', primary)
  })

  // To keep app startup fast, some non-essential code is delayed.
  setTimeout(onDelayedStartup, 3000)
}

function onBrowserReset () {
  makeBackgroundWindow('background', screen.getPrimaryDisplay())
}

function onBrowserRendered () {
  if (backgroundWindow.length === 1) {
    if (dev) console.timeEnd('init')
  } else {
    setTimeout(function () {
      destroyWindowOfId(lastWinId)
    }, 4000)
  }
}

function onDisplayAdded (e, newDisplay) {
  const primary = screen.getPrimaryDisplay()
  const secondary = getAllSecondaryDisplays()

  const primaryWin = getPrimaryWin()
  primaryWin.display = primary

  for (let match, display, i = 0, il = secondary.length; i < il; ++i) {
    display = secondary[i]
    match = false

    for (let j = 0, jl = backgroundWindow.length; j < jl; ++j) {
      if (backgroundWindow[i].display.id === display.id) {
        match = true
        break
      }
    }

    if (match) break
    makeBackgroundWindow('clone', display)
  }

  resizeBackgrounds()
}

function onDisplayRemoved (e, oldDisplay) {
  const primaryWin = getPrimaryWin()

  if (oldDisplay.id === primaryWin.display.id) {
    const primary = screen.getPrimaryDisplay()

    for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
      if (!backgroundWindow[i]) continue
      if (backgroundWindow[i].display.id === primary.id) {
        destroyWindowOfId(backgroundWindow[i].id)
      }
    }

    resizeBackgrounds()
    return
  }

  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (!backgroundWindow[i]) continue
    if (backgroundWindow[i].display.id === oldDisplay.id) {
      destroyWindowOfId(backgroundWindow[i].id)
    }
  }
}

function onSuspend () {
  ipcHandler.sendToWindows('suspend')
}

function onResume () {
  ipcHandler.sendToWindows('resume')
}

function onDelayedStartup () {
  require('./app/main/autolaunch')
}

function getPrimaryWin () {
  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (backgroundWindow[i].id === currentWinId) {
      return backgroundWindow[i]
    }
  }
}

function getAllSecondaryDisplays () {
  const primary = screen.getPrimaryDisplay()
  const secondary = screen.getAllDisplays()
  const displays = []

  for (let i = 0, l = secondary.length; i < l; ++i) {
    if (secondary[i].id === primary.id) continue
    displays.push(secondary[i])
  }

  return displays
}

function destroyWindowOfId (id) {
  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (backgroundWindow[i].id !== id) continue

    backgroundWindow[i].destroy()
    backgroundWindow[i] = null
    backgroundWindow.splice(i, 1)
    ipcHandler.removeCachedId(id)
    break
  }
}

function makeBackgroundWindow (type, display) {
  const bounds = display.bounds
  const url = type === 'background' ? backgroundUrl : backgroundCloneUrl

  let win = new electron.BrowserWindow({
    title: 'Galeri',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height + 5,
    type: 'desktop',
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    frame: false,
    transparent: true,
    enableLargerThanScreen: true,
    webPreferences: {
      webAudio: false,
      webgl: false,
      backgroundThrottling: false
    }
  })

  ipcHandler.cacheId('background', win.id)
  handleSession(url, win.webContents.session)

  win.display = display
  win.setVisibleOnAllWorkspaces(true)
  win.setSkipTaskbar(true)
  win.once('ready-to-show', win.showInactive)
  win.once('closed', function () {
    win = null
  })
  win.loadURL(url)

  win.on('move', onBackgroundMove)

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  if (type === 'background') {
    lastWinId = currentWinId
    currentWinId = win.id
  }

  backgroundWindow.push(win)
}

function onBackgroundMove () {
  console.log('BOOOOOOOOOOOOO')
  return setTimeout(() => {
    const { width, height } = screen.getPrimaryDisplay().size

    this.setSize(width, height + 5)
    this.setPosition(0, 0)
  }, 200)
}

function resizeBackgrounds () {
  setTimeout(function () {
    for (let win, bounds, i = 0, l = backgroundWindow.length; i < l; ++i) {
      win = backgroundWindow[i]
      bounds = win.display.bounds
      win.setPosition(bounds.x, bounds.y)
      win.setSize(bounds.width, bounds.height)
    }
  })
}
