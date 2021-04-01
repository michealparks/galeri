
import { resolve } from 'path'

export const APP_VERSION = require(resolve('./package.json')).version

export const URLS = {
	website: 'https://galeri.io',
	github: 'https://github.com/michealparks/galeri',
	githubRaw: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
	githubReleaseAPI: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',
	feedUrl: 'https://raw.githubusercontent.com/michealparks/galeri-www/master/updater.json',
	feedUrlWindows: 'https://github.com/michealparks/galeri/releases/download',
	issues: 'https://github.com/michealparks/galeri-www/issues'
}
