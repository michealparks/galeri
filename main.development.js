// Handle restart due to windows updates
if (!require('electron-squirrel-startup')) {
  const electron = require('electron')
  const { sendToWindows } = require('./app/main/ipc')
  const updater = require('./app/main/updater')
  const menubarWindow = require('./app/main/menubar')
  const { app, BrowserWindow, ipcMain } = electron
  const delayedInitTime = 3000
  let backgroundWindow = []
  let i = 0

  // not sure if this actually does anything :/
  app.commandLine.appendSwitch('disable-http-cache')

  // TODO restart app and send crash report
  process.on('uncaughtException', function (e) {
    console.error(e)
  })

  app.on('ready', function () {
    init()

    electron.powerMonitor.on('suspend', sendToWindows.bind(null, 'suspend'))
    electron.powerMonitor.on('resume', sendToWindows.bind(null, 'resume'))

    // To keep app startup fast, some non-essential code is delayed.
    setTimeout(() => {
      require('./app/main/app-config')
      require('./app/main/autolaunch')
      updater.init()
    }, delayedInitTime)
  })

  ipcMain.on('browser-reset', init)
  ipcMain.on('browser-rendered', onBrowserRender)

  if (process.platform !== 'darwin') {
    app.on('window-all-closed', app.quit)
  }

  if (process.env.NODE_ENV === 'development') {
    menubarWindow.on('after-create-window', () =>
      menubarWindow.window.openDevTools({ mode: 'detach' }))
  }

  function onBrowserRender () {
    if (backgroundWindow.length === 1) return

    setTimeout(() => {
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
    win.on('closed', () => { win = null })
    win.loadURL(`file://${__dirname}/app/background.html`)

    if (process.env.NODE_ENV === 'development') {
      require('electron-debug')()
      win.openDevTools({ mode: 'detach' })
    }

    backgroundWindow.push(win)
  }
}
