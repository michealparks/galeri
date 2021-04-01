
import './polyfill'
import './updater'
import { app, shell, powerMonitor } from 'electron'
import wallpaper from 'wallpaper'
import { apis } from '../apis'
import { image } from './image'
import { tray } from './tray'
import { storage } from './storage'
import type { ArtObject } from '../apis/types'

// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = app.requestSingleInstanceLock()

if (gotTheLock === false) {
	app.quit()
	process.exit(0)
}

app.allowRendererProcessReuse = true

if (app.dock !== undefined) {
	app.dock.hide()
}

let previousArtwork: ArtObject
let currentArtwork: ArtObject

const setArtwork = async (forceNext: boolean) => {
	previousArtwork = currentArtwork
	currentArtwork = await apis.get(forceNext)

	const imgPath = await image.download(currentArtwork.src)

	tray.setArtwork(currentArtwork)

	await wallpaper.set(imgPath)
}

const favoriteArtwork = () => {

}

app.once('ready', async () => {
	await storage.init()

	tray.init().onEvent((event) => {
		switch (event) {
			case 'artwork': return currentArtwork.titleLink
				? shell.openExternal(currentArtwork.titleLink)
				: undefined
			case 'favorite': return favoriteArtwork()
			case 'next': return setArtwork(true)
			case 'quit': return app.quit()
		}
	})

	powerMonitor.on('suspend', () => {
		setArtwork(true)
	})

	setArtwork(false)
})
