import type { ArtObject } from '../apis/types'

import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { nanoid } from 'nanoid'
import { app, BrowserWindow, ipcMain } from 'electron'

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

	try {
		const filepath = resolve(app.getPath('appData'), 'Galeri Favorites', 'config.json')
		const favoritesFile = await readFile(filepath, { encoding: 'utf-8' })
		favoritesList = JSON.parse(favoritesFile).favorites
	} catch {}

	if (favoritesList[0] !== undefined && 'href' in favoritesList[0]) {
		favoritesList = upgradeFavoritesList(favoritesList as unknown)
	}

	ipcMain.on('favorites:update', (_, list: ArtObject[]) => {
		updateFavoritesList(list)
	})
}

const upgradeFavoritesList = (favoritesList: unknown) => {
	const newlist: ArtObject[] = []

	for (const oldArtObject of (favoritesList as OldArtObject[])) {
		newlist.push({
			id: nanoid(),
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
    return win.id
  }

	win = new BrowserWindow({
		center: true,
		show: false,
		width: 800,
		height: 500,
		maximizable: true,
		fullscreenable: false,
		skipTaskbar: true,
		backgroundColor: '#333',
		webPreferences: {
			preload: resolve(__dirname, 'preload.cjs'),
			scrollBounce: true
		}
	})

	win.setMenuBarVisibility(false)
	win.once('close', () => {
		win = undefined
	})

	await win.loadURL(`file://${app.getAppPath()}/favorites.html`)

	win.webContents.send('update', favoritesList)
	win.show()

	if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({ mode: 'detach' })
  }

	return win.id
}

const add = async (artwork: ArtObject) => {
	const index = favoritesList.findIndex(({ id }) => id === artwork.id)

	// If the artwork already is favorited, just move it to the top.
	if (index > -1) {
		favoritesList.splice(index, 1)
	}

	favoritesList = [artwork, ...favoritesList]

	win?.webContents.send('update', favoritesList)

	updateFavoritesList(favoritesList)
}

export const favorites = {
	init,
	open,
	add
}
