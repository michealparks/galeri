
import type { ArtObject } from '../apis/types'

import { isFirstAppLaunch, enforceMacOSAppLocation, openNewGitHubIssue, debugInfo } from 'electron-util'
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
import { app, shell, powerMonitor } from 'electron'
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
	nextImgPath = await image.download(next)
}

const handleCurrentArtwork = async (current: ArtObject) => {
	artwork = current
	prevImgPath = imgPath

	if (nextImgPath && image.makeFilepath(current) === nextImgPath) {
		imgPath = nextImgPath
	} else {
		imgPath = await image.download(current)
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
