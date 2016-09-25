const { NODE_ENV } = process.env
const electron = require('electron')
const { app, BrowserWindow, Menu } = electron

if (NODE_ENV === 'development') require('electron-debug')()

let backgroundWindow

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const setDevFeatures = () => {
  backgroundWindow.openDevTools({ mode: 'detach' })
  backgroundWindow.webContents.on('context-menu', (e, props) => {
    const { x, y } = props

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click () { backgroundWindow.inspectElement(x, y) }
    }]).popup(backgroundWindow)
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

  backgroundWindow.loadURL(`file://${__dirname}/app/background.html`)
  backgroundWindow.once('ready-to-show', backgroundWindow.show)
  backgroundWindow.on('closed', () => { backgroundWindow = null })

  if (NODE_ENV === 'development') setDevFeatures()
})
