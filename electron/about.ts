import { app, BrowserWindow } from 'electron'
import { APP_ICON } from '../config'

let win: BrowserWindow | undefined

const open = async (): Promise<number> => {
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
    titleBarStyle: 'hiddenInset',
    skipTaskbar: true
  })

	console.log(`${app.getAppPath()}/about/index.html`)

  win.setMenuBarVisibility(false)
  win.on('close', () => { win = undefined })

  await win.loadURL(`file://${app.getAppPath()}/about/index.html`)

	win.show()
  win.webContents.openDevTools({ mode: 'detach' })

  return win.id
}

export const about = {
	open
}