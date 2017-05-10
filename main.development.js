const dev = process.env.NODE_ENV === 'development'
const darwin = process.platform === 'darwin'
const win32 = process.platform === 'win32'

if (dev) console.time('init')

require('./app/main/crash-reporter')

const electron = require('electron')
const ipcHandler = require('./app/main/ipc')
const app = electron.app
const backgroundUrl = dev
  ? `file://${__dirname}/core/public/index.html`
  : `file://${__dirname}/build/index.html`
const backgroundCloneUrl = dev
  ? `file://${__dirname}/app/bg-clone.html`
  : `file://${__dirname}/build/bg-clone.html`

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

if (!shouldQuit) {
  require('./app/main/updater')
  initMenubar = require('./app/main/menubar')

  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('aggressive-cache-discard')
  app.commandLine.appendSwitch('js-flags', '--max_old_space_size=128 --use_strict')

  // Hide the app from the MacOS dock
  if (darwin) app.dock.hide()

  app.once('ready', onReady)

  electron.ipcMain.on('browser-reset', onBrowserReset)
  electron.ipcMain.on('browser-rendered', onBrowserRendered)
}

function onReady () {
  screen = electron.screen

  screen.on('display-metrics-changed', resizeBackgrounds)
  screen.on('display-added', onDisplayAdded)
  screen.on('display-removed', onDisplayRemoved)

  electron.powerMonitor.on('suspend', onSuspend)
  electron.powerMonitor.on('resume', onResume)

  initMenubar(function () {
    makeBackgroundWindow('background', screen.getPrimaryDisplay())

    for (let i = 0, s = getSecondaryDisplays(), l = s.length; i < l; ++i) {
      makeBackgroundWindow('clone', s[i])
    }
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

function onDisplayAdded () {
  // link the primary display to the main background
  getPrimaryWindow().display = screen.getPrimaryDisplay()

  for (let i = 0, c = getCloneWindows(), d = getSecondaryDisplays(), l = d.length; i < l; ++i) {
    // if a current clone exists, match a display with it
    if (c[i]) c[i].display = d[i]

    // if no more clones exist, make a new one for the display
    else makeBackgroundWindow('clone', d[i])
  }

  resizeBackgrounds()
}

function onDisplayRemoved () {
  // link the primary display to the main background
  getPrimaryWindow().display = screen.getPrimaryDisplay()

  for (let i = 0, c = getCloneWindows(), d = getSecondaryDisplays(), l = c.length; i < l; ++i) {
    // if a display exists, give it a current clone
    if (d[i]) c[i].display = d[i]

    // if there's a surplus, remove the clone
    else destroyWindowOfId(c[i].id)
  }

  resizeBackgrounds()
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

function getPrimaryWindow () {
  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (backgroundWindow[i].id === currentWinId) {
      return backgroundWindow[i]
    }
  }
}

function getCloneWindows () {
  const results = []

  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (backgroundWindow[i].isClone) results.push(backgroundWindow[i])
  }

  return results
}

function getSecondaryDisplays () {
  const primary = screen.getPrimaryDisplay()
  const secondary = screen.getAllDisplays()
  const results = []

  for (let i = 0, l = secondary.length; i < l; ++i) {
    if (secondary[i].id !== primary.id) results.push(secondary[i])
  }

  return results
}

function destroyWindowOfId (id) {
  for (let i = 0, l = backgroundWindow.length; i < l; ++i) {
    if (backgroundWindow[i].id !== id) continue

    // allow the window to fire onbeforeunload internally
    backgroundWindow[i].close()

    // remove references
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
    width: bounds.width,
    height: bounds.height + 5,
    x: bounds.x,
    y: bounds.y,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: true,
    focusable: !win32,
    fullscreenable: false,
    skipTaskbar: true,
    title: 'Galeri',
    show: false,
    frame: false,
    enableLargerThanScreen: true,
    hasShadow: false,
    thickFrame: false,
    transparent: true,
    // mac/linux: sets window behind all others and ignores clicks
    type: 'desktop',
    webPreferences: {
      // share session data among all backgrounds
      partition: 'persist:galeri',
      webgl: false,
      webAudio: false,
      backgroundThrottling: false
    }
  })

  if (type === 'background') {
    lastWinId = currentWinId
    currentWinId = win.id
  }

  win.display = display
  win.isClone = type !== 'background'

  ipcHandler.cacheId('background', win.id)

  win.setVisibleOnAllWorkspaces(true)

  // This is required for windows to ignore mouse clicks
  if (win32) win.setIgnoreMouseEvents(true)

  // showInactive won't focus the window
  win.once('ready-to-show', function () {
    win.showInactive()
    win.blurWebView()
  })
  win.once('closed', function () { win = null })

  // Moving the taskbar on windows can jolt the background out of place
  win.on('move', resizeBackgrounds)
  win.on('resize', resizeBackgrounds)
  win.on('focus', win.blur)

  win.loadURL(url)

  if (dev) {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  backgroundWindow.push(win)
}

function resizeBackgrounds () {
  setTimeout(function () {
    for (let win, i = 0, l = backgroundWindow.length; i < l; ++i) {
      win = backgroundWindow[i]
      win.setBounds(win.display.bounds, false)
    }
  })
}
