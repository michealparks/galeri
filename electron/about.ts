import { app, BrowserWindow } from 'electron'

let win: BrowserWindow | undefined

const open = async (): Promise<number> => {
  if (win !== undefined) {
    win.center()
    win.focus()
    win.restore()
    return win.id
  }

  win = new BrowserWindow({
    center: true,
    show: false,
    width: 400,
    height: 250,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    skipTaskbar: true
  })

  win.setMenuBarVisibility(false)
  win.once('close', () => { win = undefined })

  await win.loadURL(`file://${app.getAppPath()}/about.html`)

	win.show()

  if (process.env.NODE_ENV === 'dev') {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  return win.id
}

export const about = {
	open
}
