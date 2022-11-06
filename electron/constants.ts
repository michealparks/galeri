
import path from 'node:path'
import { app } from 'electron'

export const APPDATA_PATH = app.getPath('appData')
export const GALERI_DATA_PATH = path.resolve(APPDATA_PATH, 'Galeri')
export const FAVORITES_DATA_PATH = path.resolve(APPDATA_PATH, 'Galeri', 'favorites.json')
export const DEPRECATED_FAVORITES_DATA_PATH = path.resolve(APPDATA_PATH, 'Galeri Favorites', 'config.json')

export const ICON_PATH = `${app.getAppPath()}/icon_32x32.png`
export const ICON_DARK_PATH = `${app.getAppPath()}/icon-dark_32x32.png`
export const ABOUT_PATH = `${app.getAppPath()}/about.html`
export const FAVORITES_PATH = `${app.getAppPath()}/favorites.html`

export const ERROR_EEXIST = 'EEXIST'
export const ERROR_ENOENT = 'ENOENT'

export const URLS = {
	website: 'https://galeri.io',
	github: 'https://github.com/michealparks/galeri',
	githubRaw: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
	githubReleaseAPI: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',
	feedUrl: 'https://raw.githubusercontent.com/michealparks/galeri-www/master/updater.json',
	feedUrlWindows: 'https://github.com/michealparks/galeri/releases/download',
	issues: 'https://github.com/michealparks/galeri-www/issues'
}

export { version as APP_VERSION } from '../package.json'
