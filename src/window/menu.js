import electron, {BrowserWindow} from 'electron'
import {format} from 'url'
import {resolve} from 'path'

const WIDTH = 240
const HEIGHT = 300

let tray, win

function onClose () {
  win = undefined
}

function calculatePosition () {
  const {screen} = electron
  const point = screen.getCursorScreenPoint()
  const screensize = screen.getDisplayNearestPoint(point).workArea

  return [point.x - (WIDTH / 2), 30]
}

export function sendMenu (channel, arg) {
  if (win === undefined) return

  win.webContents.send(channel, arg)
}

export function toggleMenu (bounds, artwork, settings) {
  if (win !== undefined) {
    win.close()
    return false
  }

  win = new BrowserWindow({
    title: '',
    alwaysOnTop: __dev,
    resizable: false,
    transparent: true,
    frame: false,
    show: false,
    width: WIDTH,
    height: HEIGHT,
    webPreferences: {
      webAudio: false,
      webgl: false,
      nodeIntegration: true,
      additionalArguments: [JSON.stringify({artwork, settings})]
    }
  })

  win.setVisibleOnAllWorkspaces(true)
  win.setMenuBarVisibility(false)

  win.once('ready-to-show', win.show)
  win.on('close', onClose)

  const position = calculatePosition()

  win.setPosition(position[0], position[1])

  if (__dev) win.openDevTools({mode: 'detach'})

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, 'menu.html')
  }))

  return true
}
