import type { ArtObject } from '../apis/types'

import {
	GALERI_DATA_PATH,
	FAVORITES_DATA_PATH,
	DEPRECATED_FAVORITES_DATA_PATH,
	FAVORITES_PATH,
	ERROR_ENOENT
} from './constants'

import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import { nanoid } from 'nanoid'
import { BrowserWindow, ipcMain } from 'electron'
import { makeDirectory, reportError } from './util'
import { fileURLToPath } from 'url'
import url from 'url'

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
let favoritesList: ArtObject[]

// Upgrades the old favorites file if on the user's computer
const upgradeFavoritesFile = async () => {
	try {
		const favoritesFile = await readFile(DEPRECATED_FAVORITES_DATA_PATH, 'utf-8')
		const favoritesList = upgradeFavoritesList(JSON.parse(favoritesFile).favorites as unknown)
		await unlink(DEPRECATED_FAVORITES_DATA_PATH)
		await writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: favoritesList }))
	} catch (error) {
		reportError('upgradeFavoritesFile(): ', error, ERROR_ENOENT)
	}
}

const initFavorites = async (): Promise<void> => {
	await makeDirectory(GALERI_DATA_PATH)
	await upgradeFavoritesFile()

	// Get the favorites list
	try {
		const file = await readFile(FAVORITES_DATA_PATH, 'utf-8')
		const json = JSON.parse(file)
		favoritesList = json.favorites
	} catch (error) {
		reportError('favorites.init(): ', error, ERROR_ENOENT)
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
			providerLink: '',
		})
	}

	updateFavoritesList(newlist)

	return newlist
}

const updateFavoritesList = (list: ArtObject[]) => {
	try {
		writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: list }))
		favoritesList = list
	} catch (error) {
		reportError('updateFavoritesList(): ', error)
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
			preload: path.resolve(fileURLToPath(import.meta.url), 'preload.cjs'),
			scrollBounce: true,
		},
	})

	win.setMenuBarVisibility(false)

	win.once('close', () => {
		win = undefined
	})

	console.log(import.meta.url)
	console.log(path.resolve(fileURLToPath(import.meta.url), '..', 'favorites.html'))
	await win.loadURL(`file://${path.resolve(fileURLToPath(import.meta.url), '..', 'favorites.html')}`)

	win.webContents.send('update', favoritesList)
	win.show()

	if (process.env.NODE_ENV === 'development') {
		win.webContents.openDevTools({ mode: 'detach' })
	}

	return win.id
}

const add = (artwork: ArtObject): void => {
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
	init: initFavorites,
	open,
	add,
}
