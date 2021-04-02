
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

let artwork: ArtObject
let imgPath: string
let prevImgPath: string

const setArtwork = async (forceNext: boolean) => {
	artwork = await apis.get(forceNext)

	prevImgPath = imgPath
	imgPath = await image.download(artwork.src)

	tray.setArtwork(artwork)

	await wallpaper.set(imgPath)
	await image.remove(prevImgPath)
}

const favoriteArtwork = () => {

}

app.once('ready', async () => {
	await storage.init()

	tray.init().onEvent((event) => {
		switch (event) {
			case 'artwork': return artwork.titleLink
				? shell.openExternal(artwork.titleLink)
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
