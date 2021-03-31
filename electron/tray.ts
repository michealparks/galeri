import { Tray, Menu, app } from 'electron'
import type { MenuItemConstructorOptions } from 'electron/main'

type Callback = {
	(param: string): void
}

let _tray: Tray
let eventCallback: Callback

const menuTemplate = [
	{
		label: '',
		click: () => eventCallback('artwork')
	}, {
		label: 'Next Artwork',
		type: 'normal',
		click: () => eventCallback('next')
	}, {
		label: 'Add to favorites',
		type: 'normal',
		click: () => eventCallback('favorite')
	}, {
		type: 'separator'
	}, {
		label: 'Options',
		submenu: [
			{
				label: 'Next artwork after:',
				enabled: false
			}, {
				label: 'Suspend',
				type: 'checkbox',
				click: () => eventCallback('options:suspend')
			}, {
				label: 'Log out',
				type: 'checkbox',
				click: () => eventCallback('options:logout')
			}, {
				label: 'Shut down',
				type: 'checkbox',
				click: () => eventCallback('options:shutdown')
			}, {
				type: 'separator'
			}, {
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
		click: () => eventCallback('favorites')
	}, {
		label: 'About',
		role: 'help',
		type: 'normal',
		click: () => eventCallback('about')
	}, {
		label: 'Quit',
		role: 'quit',
		type: 'normal',
		click: () => eventCallback('quit')
	}
]

const onEvent = (fn: Callback) => {
	eventCallback = fn
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
