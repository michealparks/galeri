const electron = require('electron')
const {BrowserWindow} = electron
const {resolve} = require('path')
const {format} = require('url')
const windows = {}

let screen
let isAllowedResize = false

const makeWindow = (display) => {
  const {bounds} = display

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
    focusable: !__win32__,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    frame: false,
    enableLargerThanScreen: true,
    thickFrame: false,
    transparent: true,
    backgroundColor: '#80FFFFFF',
    type: 'desktop',
    webPreferences: {
      webgl: false,
      webAudio: false,
      backgroundThrottling: false
    }
  })

  win.display = display

  win.setVisibleOnAllWorkspaces(true)

  // This is required for windows to ignore mouse clicks
  if (__win32__) win.setIgnoreMouseEvents(true)

  // showInactive won't focus the window
  win.once('ready-to-show', win.showInactive)
  win.once('closed', () => { win = undefined })

  // Moving the taskbar on windows can jolt the background out of place
  win.on('move', resizeBackgrounds)
  win.on('resize', resizeBackgrounds)

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, __dev__ ? 'app' : 'build', 'background.html')
  }))

  if (__dev__) {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  // why do we need this???
  if (__linux__) resizeBackgrounds()

  windows[win.id] = win

  return win
}

const setBounds = () => {
  const w = screen.getAllDisplays()
  for (let i = 0, l = w.length; i < l; ++i) {
    w[i].setBounds(w[i].display.bounds, false)
  }
}

const resizeBackgrounds = () => {
  if (!isAllowedResize) {
    isAllowedResize = true
  } else {
    setTimeout(setBounds)
  }
}

const destroyWindowOfId = (id) => {
  const win = windows[id]

  win.destroy()

  delete windows[id]
}

const onDisplayChange = (e, display) => {
  const keys = Object.keys(windows)
  const length = keys.length

  for (let i = 0; i < length; i += 1) {
    if (windows[i].display.id === display.id) {
      isAllowedResize = false
      return windows[i].setBounds(display.bounds, false)
    }
  }
}

const onDisplayAdd = (e, newDisplay) => {
  makeWindow(newDisplay)
  resizeBackgrounds()
}

const onDisplayRemove = (e, oldDisplay) => {
  const keys = Object.keys(windows)
  const length = keys.length

  for (let i = 0; i < length; i += 1) {
    const win = windows[keys[i]]
    if (win.display.id !== oldDisplay.id) continue

    destroyWindowOfId(win.id)
  }

  resizeBackgrounds()
}

const initDisplays = () => {
  screen = electron.screen

  screen.on('display-metrics-changed', onDisplayChange)
  screen.on('display-added', onDisplayAdd)
  screen.on('display-removed', onDisplayRemove)

  const displays = screen.getAllDisplays()
  const length = displays.length

  for (let i = 0; i < length; i += 1) {
    makeWindow(displays[i])
  }
}

module.exports = initDisplays
