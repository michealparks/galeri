import { Tray, Menu, app } from 'electron'
import type { MenuItemConstructorOptions } from 'electron/main'
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
	_tray.setContextMenu(Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[]))
}

const init = () => {
	_tray = new Tray('./assets/icon-dark_32x32.png')
  _tray.setContextMenu(Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[]))
  return { onEvent }
}

export const tray = {
	init,
	setArtwork
}
