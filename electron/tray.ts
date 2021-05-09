import { Tray, Menu, app } from 'electron'
import { darkMode } from 'electron-util'

import type { MenuItemConstructorOptions } from 'electron'
import type { ArtObject, Subscriber } from '../apis/types'

let _tray: Tray
let subscriber: Subscriber

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
		label: 'About',
		role: 'about',
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
		click: () => subscriber('artwork')
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

const onEvent = (fn: Subscriber) => {
	subscriber = fn
}

const setUpdating = () => {
	_tray.setContextMenu(updatingTemplate)
}

const setArtwork = (artwork: ArtObject): void => {
	if (artwork.title === undefined) {
		return
	}

	menuTemplate[2].label = artwork.title.length > 30
		? `${artwork.title.substring(0, 30)}...`
		: artwork.title

	_tray.setToolTip(artwork.title)
	_tray.closeContextMenu()
	_tray.setContextMenu(Menu.buildFromTemplate(menuTemplate))
}

const getIconPath = (dark: boolean) => {
	return `${app.getAppPath()}/icon${dark ? '-dark' : ''}_32x32.png`
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
