import type { ArtObject } from '../apis/types'

import {
	GALERI_DATA_PATH,
	FAVORITES_DATA_PATH,
	DEPRECATED_FAVORITES_DATA_PATH,
	FAVORITES_PATH,
	ERROR_EEXIST,
	ERROR_ENOENT
} from './constants'

import fs from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import { nanoid } from 'nanoid'
import { BrowserWindow, ipcMain } from 'electron'


const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

type OldArtObject = {
	href: string
	img: string
	source: string
	text: string
	title: string
}

let win: BrowserWindow | undefined
let favoritesList: ArtObject[] = []

const init = async (): Promise<void> => {
	// Create the app folder if it doesn't exist
	try {
		await mkdir(GALERI_DATA_PATH)
	} catch (err) {
		if (err.code !== ERROR_EEXIST) {
			console.warn('favorites.init(): ', err)
		}
	}

	// Upgrade the old favorites file if on the user's computer
	try {
		const favoritesFile = await readFile(DEPRECATED_FAVORITES_DATA_PATH, { encoding: 'utf-8' })
		favoritesList = upgradeFavoritesList(JSON.parse(favoritesFile).favorites as unknown)
		await unlink(DEPRECATED_FAVORITES_DATA_PATH)
		await writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: favoritesList }))
	} catch (err) {
		if (err.code !== ERROR_ENOENT) {
			console.warn('favorites.init(): ', err)
		}

		// Get the favorites list
		try {
			const favoritesFile = await readFile(FAVORITES_DATA_PATH, { encoding: 'utf-8' })
			favoritesList = JSON.parse(favoritesFile).favorites
		} catch (err) {
			if (err.code !== ERROR_ENOENT) {
				console.warn('favorites.init(): ', err)
			}
		}
	}

	for (const favoriteItem of favoritesList) {
		if (favoriteItem.id === undefined) {
			favoriteItem.id = nanoid()
		}
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
	try {
		writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: list }))
		favoritesList = list
	} catch (err) {
		console.warn('favorites.updateFavoriteList(): ', err)
	}
	
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

	await win.loadURL(FAVORITES_PATH)

	win.webContents.send('update', favoritesList)
	win.show()

	if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({ mode: 'detach' })
  }

	return win.id
}

const add = async (artwork: ArtObject): Promise<void> => {
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
