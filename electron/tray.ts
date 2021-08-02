import { Tray, Menu, app, shell } from 'electron'
import { darkMode } from 'electron-util'

import type { MenuItemConstructorOptions } from 'electron'
import type { ArtObject, Subscriber } from '../apis/types'
import { ICON_DARK_PATH, ICON_PATH } from './constants'

let _tray: Tray
let subscriber: Subscriber
let artworkLink: string | undefined

const baseItems: MenuItemConstructorOptions[] = [
	{
		type: 'separator'
	}, {
		label: 'Options',
		submenu: [
			{
				label: 'Run On Startup',
				type: 'checkbox',
				checked: app.getLoginItemSettings().openAtLogin,
				click: () => app.setLoginItemSettings({
					openAtLogin: !app.getLoginItemSettings().openAtLogin
				})
			},
		]
	}, {
		type: 'separator'
	}, {
		label: 'Favorites',
		type: 'normal',
		click: () => subscriber('favorites')
	}, {
		// Don't use role "about", it overrides opening our own Browserwindow
		label: 'About',
		type: 'normal',
		click: () => subscriber('about')
	}, {
		label: 'Quit',
		role: 'quit',
		type: 'normal',
		click: () => subscriber('quit')
	}
]

const updatingTemplate = Menu.buildFromTemplate([
	{
		label: 'Galeri',
		enabled: false,
	}, {
		type: 'separator'
	}, {
		label: 'Updating...',
		enabled: false,
	},
	...baseItems
])

const menuTemplate: MenuItemConstructorOptions[] = [
	{
		label: 'Galeri',
		enabled: false,
	}, {
		type: 'separator'
	}, {
		label: '',
		click: () => artworkLink ? shell.openExternal(artworkLink) : undefined,
		enabled: false
	}, {
		label: 'Next Artwork',
		type: 'normal',
		click: () => subscriber('next')
	}, {
		label: 'Add to Favorites',
		type: 'normal',
		click: () => subscriber('favorite')
	},
	...baseItems
]

const onEvent = (fn: Subscriber): void => {
	subscriber = fn
}

const setUpdating = (): void => {
	_tray.setContextMenu(updatingTemplate)
}

const setArtwork = (artwork: ArtObject): void => {
	if (artwork.title === undefined) {
		return
	}

	artworkLink = artwork.titleLink
	menuTemplate[2].label = artwork.title.length > 30
		? `${artwork.title.substring(0, 30)}...`
		: artwork.title

	menuTemplate[2].enabled = (artworkLink !== undefined && artworkLink !== '')

	_tray.setToolTip(artwork.title)
	_tray.closeContextMenu()
	_tray.setContextMenu(Menu.buildFromTemplate(menuTemplate))
}

const getIconPath = (dark: boolean): string => {
	return dark ? ICON_DARK_PATH : ICON_PATH
}

type EventObject = {
	onEvent: Subscriber
}

const init = (): EventObject => {
	_tray = new Tray(getIconPath(darkMode.isEnabled))
	setUpdating()

	darkMode.onChange(() => {
		_tray.setImage(getIconPath(darkMode.isEnabled))
	})

	return { onEvent }
}

export const tray = {
	init,
	setArtwork,
	setUpdating
}
