module.exports = initUpdater

const https = require('https')
const {autoUpdater} = require('electron')
const config = require('../../config')
const req = require('url').parse(config.GITHUB_RELEASE_API)
const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/

let updateListener

req.headers = { 'User-Agent': 'michealparks' }

function initUpdater () {
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

  setInterval(() =>
    check(onCheck), config.CHECK_UPDATE_INTERVAL)

  return {onUpdateAvailable}
}

function onUpdateAvailable (listener) {
  updateListener = listener
}

function check (next) {
  return getLatestTag((err, tag) => {
    if (err) next(err)

    if (tag === undefined || !isValid(tag)) {
      next({ type: 'error', msg: 'Could not find a valid release tag.' })
    }

    if (!isNewerVersionAvailable(tag)) {
      next({ type: 'warn', msg: 'There is no newer version.' })
    }

    getFeedURL(tag, next)
  })
}

function onCheck (err, feedUrl) {
  if (err) return console.error(err)

  autoUpdater.setFeedURL(feedUrl)
  autoUpdater.checkForUpdates()
}

function getLatestTag (next) {
  return https.get(req, (res) => {
    let body = ''
    res.on('error', next)
    res.on('data', (d) => { body += d })
    res.on('end', () => next(undefined, JSON.parse(body).tag_name))
  })
  .on('error', next)
  .setTimeout(10000)
}

function isValid (tag) {
  return tag.slice(1).split('.').length === 3
}

function isNewerVersionAvailable (latest) {
  const latestArr = latest.slice(1).split('.')
  const currentArr = __VERSION__.slice(1).split('.')

  // Major version update
  if (Number(latestArr[0]) > Number(currentArr[0])) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Minor version update
  if (Number(latestArr[1]) > Number(currentArr[1])) {
    if (updateListener) updateListener(latest)
    return true
  }

  // Patch update
  if (Number(latestArr[2]) > Number(currentArr[2])) return true
  // No update
  return false
}

function getFeedURL (tag, next) {
  if (__win32__) {
    return next(`${config.GITHUB_URL}/releases/download/${tag}`)
  }

  return https.get(`${config.GITHUB_URL_RAW}/updater.json`, (res) => {
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

      return next(undefined, `${config.GITHUB_URL_RAW}/updater.json`)
    })
  })
  .on('error', next)
  .setTimeout(10000)
}
