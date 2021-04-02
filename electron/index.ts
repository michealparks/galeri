
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
let nextImgPath: string
let prevImgPath: string

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
			case 'next': return apis.get(true)
			case 'quit': return app.quit()
		}
	})

	apis.store.subscribe('next', async (next) => {
		nextImgPath = await image.download(next.src)
	})

	apis.store.subscribe('current', async (current) => {
		artwork = current
		prevImgPath = imgPath

		if (nextImgPath && image.filepath(current.src) === nextImgPath) {
			imgPath = nextImgPath
		} else {
			imgPath = await image.download(current.src)
		}
	
		tray.setArtwork(current)
	
		await wallpaper.set(imgPath)
	
		if (prevImgPath) {
			await image.remove(prevImgPath)
		}
	})

	powerMonitor.on('suspend', () => {
		apis.get(true)
	})

	apis.get(false)
})
