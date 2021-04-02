import os from 'os'
import { autoUpdater } from 'electron'
import { URLS, APP_VERSION } from './constants'

autoUpdater.on('update-downloaded', () => {
	autoUpdater.quitAndInstall()
})

const parseTag = (tag = '') => {
	return (
		tag.startsWith('v')
			? tag.slice(1)
			: tag
	).split('.').map((v) => parseInt(v, 10))
}

const newVersionExists = (tag: number[]) => {
	for (const [i, curVersion] of parseTag(APP_VERSION).entries()) {
		if (curVersion > tag[i]) return false
	}

	return true
}

const init = async () => {
	const latestTag = await (globalThis as any).fetchJSON(URLS.githubReleaseAPI, {
		headers: 'User-Agent: galeri'
	})
	const tag = parseTag(latestTag.tag_name)

	if (newVersionExists(tag)) {
		autoUpdater.setFeedURL({
			url: os.platform() === 'win32'
				? `${URLS.feedUrlWindows}/${latestTag.tag_name}`
				: URLS.feedUrl
		})
		autoUpdater.checkForUpdates()
	}

	setTimeout(init, 1000 * 60 * 60)
}

init()
