import {
  GITHUB_RELEASE_API,
  CHECK_UPDATE_INTERVAL,
  GITHUB_URL,
  GITHUB_URL_RAW
} from '../../config'

import {get} from 'https'
import {autoUpdater} from 'electron'
import url from 'url'

const req = url.parse(GITHUB_RELEASE_API)
const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/

let updateListener

req.headers = {'User-Agent': 'michealparks'}

export default () => {
  if (__dev__) {
    autoUpdater.on('error', e =>
      console.error('update error: ', e))
    autoUpdater.on('checking-for-update', e =>
      console.log('checking for update: ', e))
    autoUpdater.on('update-available', e =>
      console.log('update available: ', e))
    autoUpdater.on('update-not-available', e =>
      console.log('update not available: ', e))
  }

  autoUpdater.on('update-downloaded', (msg) =>
    autoUpdater.quitAndInstall())

  check(onCheck)

  setInterval(() => check(onCheck), CHECK_UPDATE_INTERVAL)

  return {onUpdateAvailable}
}

const onUpdateAvailable = (listener) => {
  updateListener = listener
}

const check = (next) => getLatestTag((err, tag) => {
  if (err) next(err)

  if (tag === undefined || !isValid(tag)) {
    next({ type: 'error', msg: 'Could not find a valid release tag.' })
  }

  if (!isNewerVersionAvailable(tag)) {
    next({ type: 'warn', msg: 'There is no newer version.' })
  }

  getFeedURL(tag, next)
})

const onCheck = (err, feedUrl) => {
  if (err) return console.error(err)

  autoUpdater.setFeedURL(feedUrl)
  autoUpdater.checkForUpdates()
}

const getLatestTag = (next) => {
  return get(req, (res) => {
    let body = ''
    res.on('error', next)
    res.on('data', (d) => { body += d })
    res.on('end', () => next(undefined, JSON.parse(body).tag_name))
  })
    .on('error', next)
    .setTimeout(10000)
}

const isValid = (tag) => {
  return tag.slice(1).split('.').length === 3
}

const isNewerVersionAvailable = (latest) => {
  const latestArr = latest.slice(1).split('.')
  const currentArr = __VERSION__.slice(1).split('.')

  // Major version update
  if (Number.parseInt(latestArr[0], 10) > Number.parseInt(currentArr[0], 10)) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Minor version update
  if (Number.parseInt(latestArr[1], 10) > Number.parseInt(currentArr[1], 10)) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Patch update
  if (Number.parseInt(latestArr[2], 10) > Number.parseInt(currentArr[2], 10)) {
    return true
  }

  // No update
  return false
}

const getFeedURL = (tag, next) => {
  if (__win32__) {
    return next(`${GITHUB_URL}/releases/download/${tag}`)
  }

  return get(`${GITHUB_URL_RAW}/updater.json`, (res) => {
    let body = ''

    res.on('error', next)
    res.on('data', (d) => { body += d })
    res.on('end', () => {
      if (res.statusCode === 404) {
        return next({
          type: 'error',
          msg: 'updater.json does not exist.'
        })
      }

      if (res.statusCode !== 200) {
        return next({
          type: 'warn',
          msg: `Unable to fetch updater.json: ${res.body}`
        })
      }

      let zipUrl

      try {
        zipUrl = JSON.parse(body).url
      } catch (err) {
        return next({
          type: 'error',
          msg: `Unable to parse the updater.json: ${err.message}, body: ${res.body}`
        })
      }

      const match = zipUrl.match(REGEX_ZIP_URL)
      if (!match) {
        return next({
          type: 'error',
          msg: `The zipUrl (${zipUrl}) is a invalid release URL`
        })
      }

      const zipVerison = match[match.length - 1]
      if (zipVerison !== tag.slice(1)) {
        next({
          type: 'error',
          msg: `The feedUrl does not link to latest tag (zipUrl=${zipVerison}; latestVersion=${tag})`
        })
      }

      return next(undefined, `${GITHUB_URL_RAW}/updater.json`)
    })
  })
    .on('error', next)
    .setTimeout(10000)
}
