import { BrowserWindow } from 'electron'
import { ABOUT_PATH } from './constants'

let win: BrowserWindow | undefined

const open = async (): Promise<number> => {
	if (win !== undefined) {
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
		skipTaskbar: true,
	})

	win.setMenuBarVisibility(false)
	win.once('close', () => { win = undefined })

	await win.loadURL(ABOUT_PATH)

	win.show()

	if (process.env.NODE_ENV === 'development') {
		win.webContents.openDevTools({ mode: 'detach' })
	}

	return win.id
}

export const about = {
	open,
}
