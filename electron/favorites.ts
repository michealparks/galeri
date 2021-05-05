import type { ArtObject } from '../apis/types'

import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { APP_ICON } from '../config'

const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

type OldArtObject = {
	href: string
	img: string
	source: string
	text: string
	title: string
}

let win: BrowserWindow | undefined
let favoritesList: ArtObject[] = []

const init = async () => {
	try {
		await mkdir(resolve(app.getPath('appData'), 'Galeri Favorites'))
	} catch {}

	const filepath = resolve(app.getPath('appData'), 'Galeri Favorites', 'config.json')
	const favoritesFile = await readFile(filepath, { encoding: 'utf-8' })

	try {
		favoritesList = JSON.parse(favoritesFile).favorites
	} catch {}

	if (favoritesList[0] && 'href' in favoritesList[0]) {
		favoritesList = upgradeFavoritesList(favoritesList as unknown)
	}
}

const upgradeFavoritesList = (favoritesList: unknown) => {
	const newlist: ArtObject[] = []

	for (const oldArtObject of (favoritesList as OldArtObject[])) {
		newlist.push({
			src: oldArtObject.img,
			title: oldArtObject.title,
			titleLink: oldArtObject.href,
			artist: oldArtObject.text,
			artistLink: undefined,
			provider: oldArtObject.source,
			providerLink: ''
		})
	}

	updateFavoritesList(newlist)

	return newlist
}

const updateFavoritesList = (list: ArtObject[]) => {
	const filepath = resolve(app.getPath('appData'), 'Galeri Favorites', 'config.json')
	writeFile(filepath, JSON.stringify({ favorites: list }))
}

const open = async (): Promise<number> => {
	if (win !== undefined) {
    win.focus()
    win.restore()
		win.center()
    return win.id
  }

	win = new BrowserWindow({
		title: 'Galeri | Favorites',
		icon: APP_ICON,
		center: true,
		show: false,
		width: 800,
		height: 500,
		resizable: true,
		maximizable: true,
		fullscreenable: false,
		skipTaskbar: true,
		webPreferences: {
			preload: resolve(__dirname, 'preload.cjs')
		}
	})

	win.setMenuBarVisibility(false)
	win.once('close', () => { win = undefined })

	await win.loadURL(`file://${app.getAppPath()}/favorites.html`)

	win.webContents.openDevTools({ mode: 'detach' })
	win.webContents.send('update', favoritesList)
	win.show()

	ipcMain.on('favorites:delete', (_, list: ArtObject[]) => {
		updateFavoritesList(list)
	})

	return win.id
}

const add = async (artwork: ArtObject) => {
	favoritesList.push(artwork)

	win?.webContents.send('update', favoritesList)

	updateFavoritesList(favoritesList)
}

export const favorites = {
	init,
	open,
	add
}