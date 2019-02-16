import {BrowserWindow} from 'electron'
import {format} from 'url'
import {resolve} from 'path'

export function background (display) {
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
    focusable: false,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    frame: false,
    enableLargerThanScreen: true,
    thickFrame: false,
    transparent: true,
    type: 'desktop',
    webPreferences: {
      webgl: false,
      webAudio: false,
      nodeIntegration: true,
      backgroundThrottling: false
    }
  })

  win.display = display

  win.once('ready-to-show', function () {
    win.showInactive()
  })

  win.once('closed', function () {
    win = undefined
  })

  win.openDevTools({mode: 'detach'})

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, 'index.html')
  }))

  return win
}
