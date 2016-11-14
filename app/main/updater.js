const { parse } = require('url')
const { get } = require('https')
const electron = require('electron')
const config = require('./config')
const debug = require('./log')
const WIN32 = (process.platform === 'win32')
const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/
const reqObj = Object.assign(parse(config.GITHUB_RELEASE_API), {
  headers: { 'User-Agent': 'michealparks' }
})

if (process.platform === 'linux') initLinux()
else initDarwinWin32()

function initLinux () {
  // autoupdating features don't exist...
}

function isValid (tag) {
  return tag.slice(1).split('.').length === 3
}

function getLatestTag (next) {
  return get(reqObj, function (res) {
    let body = ''
    res.on('data', function (d) { body += d })
    res.on('end', function () { next(null, JSON.parse(body).tag_name) })
    res.on('error', next)
  })
  .on('error', next)
  .setTimeout(10000)
}

function isNewerVersionAvailable (latest) {
  const latestArr = latest.slice(1).split('.')
  const currentArr = config.APP_VERSION.slice(1).split('.')

  // Major version update
  if (Number(latestArr[0]) > Number(currentArr[0])) return true

  // Minor version update
  if (Number(latestArr[1]) > Number(currentArr[1])) return true

  // Patch update
  if (Number(latestArr[2]) > Number(currentArr[2])) return true

  return false
}

function getFeedURL (tag, next) {
  return WIN32
    ? next(`${config.GITHUB_URL}/releases/download/${tag}`)
    : get(`${config.GITHUB_URL_RAW}/updater.json`, function (res) {
      let body = ''
      res.on('data', function (d) { body += d })
      res.on('error', next)
      res.on('end', function () {
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

        return next(null, `${config.GITHUB_URL_RAW}/updater.json`)
      })
    }).on('error', next)
}

function check (next) {
  return getLatestTag(function (err, tag) {
    if (err) return next(err)

    if (!tag || !isValid(tag)) {
      return next({ type: 'error', msg: 'Could not find a valid release tag.' })
    }

    if (!isNewerVersionAvailable(tag)) {
      return next({ type: 'warn', msg: 'There is no newer version.' })
    }

    return getFeedURL(tag, next)
  })
}

function initDarwinWin32 () {
  const { autoUpdater } = electron

  autoUpdater.on('error', err => console.error(err))
  autoUpdater.on('checking-for-update', msg => console.log(msg))
  autoUpdater.on('update-available', msg => console.log(msg))
  autoUpdater.on('update-not-available', msg => console.log(msg))

  autoUpdater.on('update-downloaded', function (msg) {
    console.log('update-downloaded', msg)
    return autoUpdater.quitAndInstall()
  })

  function onCheck (err, feedUrl) {
    if (err && !err.type) return console.error(err)
    if (err) return debug[err.type](err.msg)

    console.log('feed-url', feedUrl)
    autoUpdater.setFeedURL(feedUrl)
    autoUpdater.checkForUpdates()
  }

  check(onCheck)

  return setInterval(function () {
    return check(onCheck)
  }, config.CHECK_UPDATE_INTERVAL)
}
