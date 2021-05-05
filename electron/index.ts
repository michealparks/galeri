
import type { ArtObject } from '../apis/types'

import unhandled from 'electron-unhandled'
unhandled()

import './polyfill'
import { app, shell, powerMonitor } from 'electron'
import { isFirstAppLaunch, enforceMacOSAppLocation } from 'electron-util'
import wallpaper from 'wallpaper'
import { apis } from '../apis'
import { updater } from './updater'
import { image } from './image'
import { tray } from './tray'
import { storage } from './storage'
import { about } from './about'
import { favorites } from './favorites'

updater()

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

const handleTrayEvent = (event: string) => {
	switch (event) {
		case 'artwork':
			return artwork.titleLink
				? shell.openExternal(artwork.titleLink)
				: undefined
		case 'favorite':
			return favorites.add(artwork)
		case 'about':
			return about.open()
		case 'favorites':
			return favorites.open()
		case 'next':
			return apis.getArtwork(true)
		case 'quit':
			return app.quit()
	}
}

const handleNextArtwork = async (next: ArtObject) => {
	nextImgPath = await image.download(next.src)
}

const handleCurrentArtwork = async (current: ArtObject) => {
	console.log(current)
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

	const curWallpaper = await wallpaper.get()

	if (curWallpaper !== imgPath) {
		apis.getArtwork(true)
	}
}

const handleSuspend = () => {
	apis.getArtwork(true)
}

const init = async () => {
	await Promise.all([
		app.whenReady(),
		storage.init()
	])

	enforceMacOSAppLocation()

	tray.init().onEvent(handleTrayEvent)

	await apis.getArtwork(false)

	apis.store.next.subscribe(handleNextArtwork)
	apis.store.current.subscribe(handleCurrentArtwork)

	powerMonitor.on('suspend', handleSuspend)

	if (isFirstAppLaunch()) {
		app.setLoginItemSettings({ openAtLogin: true })
	}

	await favorites.init()
}

init()
