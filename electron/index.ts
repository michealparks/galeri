
import './polyfill'
import { app, shell } from 'electron'
import wallpaper from 'wallpaper'
import { apis } from '../apis'
import { image } from './image'
import { tray } from './tray'
import type { Artwork } from '../apis/types'

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

let artwork: Artwork

const setArtwork = async (forceNext: boolean) => {
	artwork = await apis.get(forceNext)
	const imgPath = await image.fromBuffer(artwork.src, artwork.buffer)
	await wallpaper.set(imgPath)

	tray.setArtwork(artwork)
}

app.once('ready', async () => {
	apis.init()

	tray.init().onEvent((event) => {
		switch (event) {
			case 'artwork': return shell.openExternal(artwork.titleLink)
			case 'next': return setArtwork(true)
			case 'quit': return app.quit()
		}
	})

	setArtwork(false)
})
