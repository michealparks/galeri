import {
  GITHUB_RELEASE_API,
  CHECK_UPDATE_INTERVAL,
  GITHUB_URL,
  GITHUB_URL_RAW
} from '../../config'

import {autoUpdater} from 'electron'
import {fetchJSON} from '../util'

const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/
const [curMaj, curMin, curPatch] = __VERSION__.slice(1).split('.')

export const initAutoUpdate = () => {
  if (__dev__) {
    autoUpdater.on('error', e => {
      console.error('update error: ', e)
    })

    autoUpdater.on('checking-for-update', e => {
      console.log('checking for update: ', e)
    })
    autoUpdater.on('update-available', e => {
      console.log('update available: ', e)
    })

    autoUpdater.on('update-not-available', e => {
      console.log('update not available: ', e)
    })
  }

  autoUpdater.on('update-downloaded', (msg) => {
    return autoUpdater.quitAndInstall()
  })

  checkForUpdate()
}

const checkForUpdate = async () => {
  const tagData = await fetchJSON(GITHUB_RELEASE_API)

  if (tagData === undefined) {
    return onEnd('Fetching tags failed.')
  }

  const tag = tagData.tag_name

  if (tag === undefined || isValid(tag) === false) {
    return onEnd('Could not find a valid release tag.')
  }

  if (!isNewerVersionAvailable(tag)) {
    return onEnd('There is no newer version.')
  }

  const feedUrl = await getFeedUrl(tag)

  autoUpdater.setFeedURL(feedUrl)
  autoUpdater.checkForUpdates()
}

const isValid = (tag) => {
  return tag.slice(1).split('.').length === 3
}

const isNewerVersionAvailable = (tag) => {
  const [maj, min, patch] = tag.slice(1).split('.')

  // Major version update
  if (parseInt(maj) > parseInt(curMaj)) return true

  // Minor version update
  if (parseInt(min) > parseInt(curMin)) return true

  // Patch update
  if (parseInt(patch) > parseInt(curPatch)) return true

  // No update
  return false
}

const getFeedUrl = async (tag) => {
  if (__win32__) return `${GITHUB_URL}/releases/download/${tag}`

  const res = await fetchJSON(`${GITHUB_URL_RAW}/updater.json`)

  if (res === undefined) {
    return onEnd('Issue fetching updator.json.')
  }

  const match = res.url.match(REGEX_ZIP_URL)

  if (!match) {
    return onEnd(`The zipUrl (${res.url}) is a invalid release URL`)
  }

  const zipVersion = match[match.length - 1]

  if (zipVersion !== tag.slice(1)) {
    return onEnd(`The feedUrl does not link to latest tag (zipUrl=${zipVersion}; latestVersion=${tag})`)
  }

  return `${GITHUB_URL_RAW}/updater.json`
}

const onEnd = (msg) => {
  if (__dev__) console.warn('Autoupdater: ', msg)
  setTimeout(checkForUpdate, CHECK_UPDATE_INTERVAL)
}
