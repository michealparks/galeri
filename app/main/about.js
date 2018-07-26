import {BrowserWindow} from 'electron'
import {APP_ICON} from '../../config'
import {getUrl} from './util'

let win

const onClose = () => {
  win = undefined
}

export default () => {
  if (win !== undefined) {
    win.focus()
    win.restore()
    return win.id
  }

  win = new BrowserWindow({
    title: 'About Galeri',
    icon: APP_ICON,
    center: true,
    show: false,
    width: 400,
    height: 300,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    skipTaskbar: true,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  win.setMenuBarVisibility(false)
  win.once('ready-to-show', win.show)
  win.on('close', onClose)
  win.loadURL(getUrl('about'))

  if (__dev__) win.openDevTools({mode: 'detach'})

  return win.id
}
