if(require('electron-squirrel-startup')) return

const electron = require('electron')
const { sendToWindows } = require('./app/main/ipc')
const initAutoUpdate = require('./app/main/autoupdate')
const initAutoLaunch = require('./app/main/autolaunch')
const menubarWindow = require('./app/main/menubar')
const { app, BrowserWindow, ipcMain } = electron
const delayedInitTime = 3000
let backgroundWindow = []
let i = 0

app.commandLine.appendSwitch('disable-http-cache')

process.on('uncaughtException', function (e) {
  console.error(e)
})



app.on('ready', function () {
  init()

  electron.powerMonitor.on('suspend', sendToWindows.bind(null, 'suspend'))
  electron.powerMonitor.on('resume', sendToWindows.bind(null, 'resume'))

  // To keep app startup fast, some non-essential code is delayed.
  setTimeout(() => {
    initAutoUpdate()
    initAutoLaunch()
  }, delayedInitTime)
})

ipcMain.on('browser-reset', reloadBrowser)
ipcMain.on('browser-render', onBrowserRender)

if (process.platform !== 'darwin') {
  app.on('window-all-closed', app.quit)
}

if (process.env.NODE_ENV === 'development') {
  menubarWindow.on('after-create-window', function () {
    // menubarWindow.window.openDevTools({ mode: 'detach' })
  })
}

function reloadBrowser () {
  init()
}

function onBrowserRender () {
  if (backgroundWindow.length === 1) return

  setTimeout(function () {
    backgroundWindow[0].destroy()
    backgroundWindow[0] = null
    backgroundWindow.shift()
  }, 4000)
}

function init () {
  const { width, height } = electron.screen.getPrimaryDisplay().size
  i = backgroundWindow.length

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
  win.on('closed', function () { win = null })
  win.loadURL(`file://${__dirname}/app/background.html`)

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
    win.openDevTools({ mode: 'detach' })
  }

  backgroundWindow.push(win)
}

