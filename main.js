const electron = require('electron')
const menubar = require('menubar')
const { initIPC } = require('./app/main/ipc')
const { NODE_ENV } = process.env
const { app, BrowserWindow, Menu } = electron

if (NODE_ENV === 'development') require('electron-debug')()

let backgroundWindow

let menubarWindow = menubar({
  index: `file://${__dirname}/app/menubar.html`,
  // icon: `file://${__dirname}/../../../build/icon_32x32.png`,
  preloadWindow: true,
  transparent: true,
  alwaysOnTop: true,
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
  winEl.webContents.on('context-menu', (e, props) => {
    const { x, y } = props

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

app.on('ready', () => {
  const { width, height } = electron.screen.getPrimaryDisplay().size

  backgroundWindow = new BrowserWindow({
    width,
    height: height + 50,
    title: 'Caboodle',
    type: 'desktop',
    show: false,
    frame: false,
    transparent: true,
    enableLargerThanScreen: true
  })

  // menubarWindow.on('ready', () => {})
  backgroundWindow.loadURL(`file://${__dirname}/app/background.html`)
  backgroundWindow.once('ready-to-show', backgroundWindow.show)
  backgroundWindow.on('closed', () => { backgroundWindow = null })

  initIPC()

  if (NODE_ENV === 'development') setDevFeatures(backgroundWindow)
})
