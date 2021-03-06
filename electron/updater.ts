import os from 'os'
import { autoUpdater } from 'electron'
import { URLS, APP_VERSION } from './constants'

const { fetchJSON } = (globalThis as any)

autoUpdater.on('update-downloaded', () => {
	autoUpdater.quitAndInstall()
})

const parseTag = (tag = ''): number[] => {
	return (
		tag.startsWith('v')
			? tag.slice(1)
			: tag
	).split('.').map((v) => parseInt(v, 10))
}

const newVersionExists = (tag: number[]): boolean => {
	for (const [i, curVersion] of parseTag(APP_VERSION).entries()) {
		if (curVersion > tag[i]) return false
	}

	return true
}

export const updater = async (): Promise<void> => {
	const latestTag = await fetchJSON(URLS.githubReleaseAPI, {
		headers: 'User-Agent: galeri'
	})

	const tag = parseTag(latestTag.tag_name)

	if (newVersionExists(tag) === true) {
		autoUpdater.setFeedURL({
			url: os.platform() === 'win32'
				? `${URLS.feedUrlWindows}/${latestTag.tag_name}`
				: URLS.feedUrl
		})
		autoUpdater.checkForUpdates()
	}

	setTimeout(updater, 1000 * 60 * 60)
}
