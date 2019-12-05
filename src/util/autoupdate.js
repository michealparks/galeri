
import https from 'https'
import {autoUpdater} from 'electron'
import {parse} from 'url'
import {requestJSON} from './index'
import {version} from '../../package.json'

import {
  CHECK_UPDATE_INTERVAL,
  GITHUB_RELEASE_API,
  GITHUB_URL,
  GITHUB_URL_RAW
} from '../../config'

const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/

let updateListener

function log (msg, method) {
  return (obj) => {
    console[method || 'log'](msg, obj)
  }
}

export function autoupdate () {
  if (__dev) {
    autoUpdater.on('error', log('error updating:', 'error'))
    autoUpdater.on('checking-for-update', log('checking:'))
    autoUpdater.on('update-available', log('update available:'))
    autoUpdater.on('update-not-available', log('no update available:'))
  }

  autoUpdater.on('update-downloaded', function (msg) {
    autoUpdater.quitAndInstall()
  })

  check(onCheck)

  setInterval(function () {
    check(onCheck)
  }, CHECK_UPDATE_INTERVAL)

  return { onUpdateAvailable }
}

function onUpdateAvailable (listener) {
  updateListener = listener
}

function check (next) {
  requestJSON(GITHUB_RELEASE_API, function (err, json) {
    if (err) return next(err)
    const tag = json.tag_name

    if (err) next(err)

    if (tag === undefined || !isValid(tag)) {
      next({type: 'error', msg: 'Could not find a valid release tag.'})
    }

    if (!isNewerVersionAvailable(tag)) {
      next({type: 'warn', msg: 'There is no newer version.'})
    }

    getFeedURL(tag, next)
  })
}

function onCheck (err, feedUrl) {
  if (err) return console.error(err)

  autoUpdater.setFeedURL(feedUrl)
  autoUpdater.checkForUpdates()
}

function isValid (tag) {
  return tag.slice(1).split('.').length === 3
}

function isNewerVersionAvailable (latest) {
  const latestArr = latest.slice(1).split('.')
  const currentArr = version.slice(1).split('.')

  // Major version update
  if ((latestArr[0] | 0) > (currentArr[0] | 0)) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Minor version update
  if ((latestArr[1] | 0) > (currentArr[1] | 0)) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Patch update
  if ((latestArr[2] | 0) > (currentArr[2] | 0)) {
    return true
  }

  // No update
  return false
}

function getFeedURL (tag, next) {
  if (__windows) {
    next(`${GITHUB_URL}/releases/download/${tag}`)
    return
  }

  requestJSON(`${GITHUB_URL_RAW}/updater.json`, function (err, json) {
    if (err) return next(err)

    const zipurl = json.url
    const match = zipurl.match(REGEX_ZIP_URL)
    const zipVerison = match[match.length - 1]

    if (!match) {
      return next({
        type: 'error',
        msg: `The zipurl (${zipurl}) is a invalid release URL`
      })
    }

    if (zipVerison !== tag.slice(1)) {
      next({
        type: 'error',
        msg: `The feedUrl does not link to latest tag (zipurl=${zipVerison}; latestVersion=${tag})`
      })
    }

    next(undefined, `${GITHUB_URL_RAW}/updater.json`)
  })
}