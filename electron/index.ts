
import type { ArtObject } from '../apis/types'

import { enforceMacOSAppLocation, openNewGitHubIssue, debugInfo } from 'electron-util'
import unhandled from 'electron-unhandled'
unhandled({
	reportButton: error => {
		openNewGitHubIssue({
			user: 'michealparks',
			repo: 'galeri',
			body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
		})
		process.exit(1)
	}
})

import './polyfill'
import { app, powerMonitor } from 'electron'
import wallpaper from 'wallpaper'
import { apis } from '../apis'
import { updater } from './updater'
import { image } from './image'
import { tray } from './tray'
import { storage } from './storage'
import { about } from './about'
import { favorites } from './favorites'
import { isFirstAppLaunch } from './util'

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
	nextImgPath = await image.download(next)
}

const handleCurrentArtwork = async (current: ArtObject) => {
	tray.setUpdating()

	artwork = current
	prevImgPath = imgPath

	if (nextImgPath !== undefined && image.makeFilepath(current) === nextImgPath) {
		imgPath = nextImgPath
	} else {
		imgPath = await image.download(current)
	}

	await wallpaper.set(imgPath)

	if (prevImgPath !== undefined) {
		image.remove(prevImgPath)
	}

	const curWallpaper = await wallpaper.get()

	if (curWallpaper !== imgPath) {
		return apis.getArtwork(true)
	}

	tray.setArtwork(current)
}

const handleSuspend = () => {
	apis.getArtwork(true)
}

const init = async () => {
	const [firstAppLaunch] = await Promise.all([
		isFirstAppLaunch(),
		app.whenReady(),
		storage.init(),
		favorites.init()
	])

	enforceMacOSAppLocation()
	tray.init().onEvent(handleTrayEvent)

	await apis.getArtwork(false)

	apis.store.next.subscribe(handleNextArtwork)
	apis.store.current.subscribe(handleCurrentArtwork)

	powerMonitor.on('suspend', handleSuspend)

	if (firstAppLaunch === true) {
		app.setLoginItemSettings({ openAtLogin: true })
	}

	app.on('window-all-closed', () => {
		// prevents the app from quitting
	})

	app.on('will-quit', (e) => {
		console.log(e)
	})
}

init()
