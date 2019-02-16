import {BrowserWindow} from 'electron'
import {format} from 'url'
import {resolve} from 'path'

let win

export function about () {
  if (win !== undefined) {
    win.focus()
    win.restore()
    return
  }

  win = new BrowserWindow({
    title: 'About Galeri',
    center: true,
    show: false,
    width: 400,
    height: 300,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden-inset',
    skipTaskbar: true,
    webPreferences: {
      webAudio: false,
      webgl: false,
      nodeIntegration: true
    }
  })

  win.setMenuBarVisibility(false)
  win.once('ready-to-show', win.show)
  win.on('close', function () {
    win = undefined
  })

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, 'about.html')
  }))
}
