const { parse } = require('url')
const { get } = require('https')
const electron = require('electron')
const semver = require('semver')
const config = require('./config')
const { log, error } = require('./log')
const WIN32 = (process.platform === 'win32')
const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/
const reqObj = Object.assign(parse(config.GITHUB_RELEASE_API), {
  headers: { 'User-Agent': 'michealparks' }
})

function init () {
  return process.platform === 'linux'
    ? initLinux()
    : initDarwinWin32()
}

function initLinux () {
  // autoupdating features don't exist...
}

function getLatestTag (next) {
  return get(reqObj, res => {
    let body = ''
    res.on('data', d => body += d)
    res.on('end', () => next(null, JSON.parse(body).tag_name))
    res.on('error', next)
  }).on('error', next)
}

function isNewVersion (latest) {
  return semver.lt(config.APP_VERSION, latest)
}

function getFeedURL (tag, next) {
  return WIN32
    ? next(`${config.GITHUB_URL}/releases/download/${tag}`)
    : get(`${config.GITHUB_URL_RAW}/updater.json`, res => {
      let body = ''
      res.on('data', d => body += d)
      res.on('end', () => {
        if (res.statusCode === 404) return next('updater.json does not exist.')
        if (res.statusCode !== 200) return next(`Unable to fetch updater.json: ${res.body}`)

        let zipUrl
        try {
          zipUrl = JSON.parse(body).url
        } catch (err) {
          return next(`Unable to parse the updater.json: ${err.message}, body: ${res.body}`)
        }

        const matchReleaseUrl = zipUrl.match(REGEX_ZIP_URL)
        if (!matchReleaseUrl) return next(`The zipUrl (${zipUrl}) is a invalid release URL`)

        const versionInZipUrl = matchReleaseUrl[matchReleaseUrl.length - 1]
        const latestVersion = semver.clean(tag)
        if (versionInZipUrl !== latestVersion) {
          next(`The feedUrl does not link to latest tag (zipUrl=${versionInZipUrl}; latestVersion=${latestVersion})`)
        }

        return next(null, `${config.GITHUB_URL_RAW}/updater.json`)
      })
    })
}

function check (next) {
  return getLatestTag((err, tag) => {
    if (err) return next(err)

    if (!tag || !semver.valid(semver.clean(tag))) {
      return next('Could not find a valid release tag.')
    }

    if (!isNewVersion(tag)) {
      return next('There is no newer version.')
    }

    log(`${config.GITHUB_URL_RAW}/updater.json`)

    return getFeedURL(tag, (err, feedUrl) => err
      ? next(err)
      : next(null, feedUrl))
  })
}

function initDarwinWin32 () {
  const { autoUpdater } = electron

  autoUpdater.on('error', error)

  autoUpdater.on('checking-for-update', msg =>
    log('checking-for-update', msg))

  autoUpdater.on('update-available', msg =>
    log('update-available', msg))

  autoUpdater.on('update-not-available', msg =>
    log('update-not-available', msg))

  autoUpdater.on('update-downloaded', msg => {
    log('update-downloaded', msg)
    return autoUpdater.quitAndInstall()
  })

  function onCheck (err, feedUrl) {
    if (err) return error(err)

    log('feed-url', feedUrl)
    autoUpdater.setFeedURL(feedUrl)
    autoUpdater.checkForUpdates()
  }

  check(onCheck)

  return setInterval(() => check(onCheck), config.CHECK_UPDATE_INTERVAL)
}

module.exports = { init }
