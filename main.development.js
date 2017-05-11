const __dev__ = process.env.NODE_ENV === 'development'
const darwin = process.platform === 'darwin'
const win32 = process.platform === 'win32'

if (__dev__) console.time('init')

require('./app/main/crash-reporter')

const {resolve} = require('path')
const {format} = require('url')
const electron = require('electron')
const ipcHandler = require('./app/main/ipc')
const {app, BrowserWindow} = electron

let screen, initMenubar, lastWinId, currentWinId
let windows = []

// Handle restart due to windows updates
let shouldQuit
if (process.platform === 'win32') {
  shouldQuit = require('./app/main/squirrel-win32')(process.argv[1])
}

// Handle possible other instances of the app
if (!shouldQuit) {
  shouldQuit = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (windows[0]) {
      if (windows[0].isMinimized()) windows[0].restore()
      windows[0].focus()
    }
  })

  if (shouldQuit) app.quit()
}

if (!shouldQuit) {
  require('./app/main/updater')
  initMenubar = require('./app/main/menubar')

  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('js-flags', '--use_strict')

  // Hide the app from the MacOS dock
  if (darwin) app.dock.hide()

  app.once('ready', onReady)

  electron.ipcMain.on('background:reset', onBackgroundReset)
  electron.ipcMain.on('background:rendered', onBackgroundRendered)
}

function onReady () {
  screen = electron.screen

  screen.on('display-metrics-changed', resizeBackgrounds)
  screen.on('display-added', onDisplayAdded)
  screen.on('display-removed', onDisplayRemoved)

  initMenubar(() => {
    makeWindow('background', screen.getPrimaryDisplay())

    for (let i = 0, s = getSecondaryDisplays(), l = s.length; i < l; ++i) {
      makeWindow('clone', s[i])
    }
  })

  // To keep app startup fast, some non-essential code is delayed.
  setTimeout(() => require('./app/main/autolaunch'), 3000)
}

function onBackgroundReset () {
  makeWindow('background', screen.getPrimaryDisplay())
}

function onBackgroundRendered () {
  if (windows.length === 1) {
    if (__dev__) console.timeEnd('init')
    return
  }

  setTimeout(() => destroyWindowOfId(lastWinId), 4000)
}

function onDisplayAdded () {
  // link the primary display to the main background
  getPrimaryWindow().display = screen.getPrimaryDisplay()

  for (let i = 0, c = getCloneWindows(), d = getSecondaryDisplays(), l = d.length; i < l; ++i) {
    // if a current clone exists, match a display with it
    if (c[i] !== undefined) c[i].display = d[i]

    // if no more clones exist, make a new one for the display
    else makeWindow('clone', d[i])
  }

  resizeBackgrounds()
}

function onDisplayRemoved () {
  // link the primary display to the main background
  getPrimaryWindow().display = screen.getPrimaryDisplay()

  for (let i = 0, c = getCloneWindows(), d = getSecondaryDisplays(), l = c.length; i < l; ++i) {
    // if a display exists, give it a current clone
    if (d[i] !== undefined) c[i].display = d[i]

    // if there's a surplus, remove the clone
    else destroyWindowOfId(c[i].id)
  }

  resizeBackgrounds()
}

function getPrimaryWindow () {
  for (let i = 0, l = windows.length; i < l; ++i) {
    if (windows[i].id === currentWinId) return windows[i]
  }
}

function getCloneWindows () {
  const results = []

  for (let i = 0, l = windows.length; i < l; ++i) {
    if (windows[i].isClone) results.push(windows[i])
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
  for (let i = 0, l = windows.length; i < l; ++i) {
    if (windows[i].id !== id) continue

    // don't allow beforeunload to fire, we've already saved config
    windows[i].destroy()

    // remove references
    windows[i] = null
    windows.splice(i, 1)

    // exit loop
    return ipcHandler.removeCachedId(id)
  }
}

function makeWindow (type, display) {
  const bounds = win32 ? display.workArea : display.bounds
  const isClone = type !== 'background'

  let win = new BrowserWindow({
    title: 'Galeri',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height + 5,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: true,
    focusable: !win32,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    frame: false,
    enableLargerThanScreen: true,
    hasShadow: false,
    thickFrame: false,
    transparent: true,
    type: 'desktop',
    webPreferences: {
      webgl: false,
      webAudio: false,
      backgroundThrottling: false
    }
  })

  if (!isClone) {
    lastWinId = currentWinId
    currentWinId = win.id
  }

  win.display = display
  win.isClone = isClone

  ipcHandler.cacheId('background', win.id)

  win.setVisibleOnAllWorkspaces(true)

  // This is required for windows to ignore mouse clicks
  if (win32) win.setIgnoreMouseEvents(true)

  // showInactive won't focus the window
  win.once('ready-to-show', win.showInactive)
  win.once('closed', () => { win = undefined })

  // Moving the taskbar on windows can jolt the background out of place
  win.on('move', resizeBackgrounds)
  win.on('resize', resizeBackgrounds)
  win.on('focus', win.blur)

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(
      __dirname,
      __dev__ ? 'app' : 'build',
      `${isClone ? 'bg-clone' : 'background'}.html`)
  }))

  if (__dev__) {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  windows.push(win)
}

function resizeBackgrounds () {
  setTimeout(() => {
    for (let win, i = 0, l = windows.length; i < l; ++i) {
      win = windows[i]
      win.setBounds(win.display.bounds, false)
    }
  })
}
