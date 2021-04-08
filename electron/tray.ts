import { Tray, Menu, app } from 'electron'
import { darkMode } from 'electron-util'

import type { MenuItemConstructorOptions } from 'electron'
import type { Subscriber } from '../apis/types'

let _tray: Tray
let subscriber: Subscriber

const menuTemplate = [
	{
		label: '',
		click: () => subscriber('artwork')
	}, {
		label: 'Next Artwork',
		type: 'normal',
		click: () => subscriber('next')
	}, {
		label: 'Add to favorites',
		type: 'normal',
		click: () => subscriber('favorite')
	}, {
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
		role: 'help',
		type: 'normal',
		click: () => subscriber('about')
	}, {
		label: 'Quit',
		role: 'quit',
		type: 'normal',
		click: () => subscriber('quit')
	}
]

const onEvent = (fn: Subscriber) => {
	subscriber = fn
}

const setArtwork = ({ title = '' }) => {
	menuTemplate[0].label = title
	_tray.setToolTip(title)
	_tray.setContextMenu(Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[]))
}

const getIconPath = (dark: boolean) => {
	return `${app.getAppPath()}/icon${dark ? '-dark' : ''}_32x32.png`
}

const init = () => {
	_tray = new Tray(getIconPath(darkMode.isEnabled))
  _tray.setContextMenu(Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[]))

	darkMode.onChange(() => {
		_tray.setImage(getIconPath(darkMode.isEnabled))
		console.log(darkMode.isEnabled)
	})

  return { onEvent }
}

export const tray = {
	init,
	setArtwork
}
