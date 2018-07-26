import {BrowserWindow} from 'electron'
import {resolve} from 'path'
import {format} from 'url'
import {APP_ICON} from '../../../config'

export const imageWindow = (display) => {
  const {bounds} = display

  let win = new BrowserWindow({
    title: 'Galeri',
    icon: APP_ICON,
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

  const onChange = () => setTimeout(() => {
    win.setBounds(win.display.bounds, false)
  })

  win.once('ready-to-show', win.showInactive)
  win.on('move', onChange)
  win.on('resize', onChange)

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, 'app', 'image.html')
  }))

  if (__dev__) win.openDevTools({mode: 'detach'})

  return win
}
