const electron = require('electron')
const menubar = require('menubar')
const { initIPC } = require('./app/main/ipc')
const initAutoUpdate = require('./app/main/autoupdate')
const initAutoLaunch = require('./app/main/autolaunch')
const { NODE_ENV } = process.env
const { app, BrowserWindow, Menu, session } = electron
const delayedInitTime = 3000

let backgroundWindow

let menubarWindow = menubar({
  index: `file://${__dirname}/app/menubar.html`,
  icon: `${__dirname}/assets/icon_32x32.png`,
  preloadWindow: true,
  showDockIcon: NODE_ENV === 'development',
  transparent: true,
  // alwaysOnTop: true,
  width: 250,
  height: 320,
  y: 30
})

menubarWindow.on('after-create-window', () => {
  if (NODE_ENV === 'development') setDevFeatures(menubarWindow.window)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const setDevFeatures = winEl => {
  winEl.openDevTools({ mode: 'detach' })
  winEl.webContents.on('context-menu', (e, { x, y }) => {
    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click () { winEl.inspectElement(x, y) }
    }]).popup(winEl)
  })

  const installer = require('electron-devtools-installer')

  return installer.default(installer.REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (backgroundWindow) {
    if (backgroundWindow.isMinimized()) backgroundWindow.restore()
  }
})

if (shouldQuit) app.quit()

app.on('ready', () => {
  const { width, height } = electron.screen.getPrimaryDisplay().size

  backgroundWindow = new BrowserWindow({
    width,
    height: height + 50,
    title: 'Galeri',
    type: 'desktop',
    resizable: false,
    movable: false,
    // partition: 'background',
    show: false,
    frame: false,
    transparent: true,
    enableLargerThanScreen: true
  })

  // TODO: this doesn't work. memory leak persisting.
  // backgroundWindow.webContents.session = session.fromPartition('background', { cache: false })

  backgroundWindow.loadURL(`file://${__dirname}/app/background.html`, {
    'extraHeaders': 'pragma: no-cache\n'
  })
  // backgroundWindow.webContents.reloadIgnoringCache()
  backgroundWindow.once('ready-to-show', backgroundWindow.show)
  backgroundWindow.on('closed', () => { backgroundWindow = null })

  initIPC()

  // To keep app startup fast, some non-essential code is delayed.
  setTimeout(() => {
    initAutoUpdate()
    initAutoLaunch()
  }, delayedInitTime)

  if (NODE_ENV === 'development') {
    require('electron-debug')()
    setDevFeatures(backgroundWindow)
  }
})
