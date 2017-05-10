const dev = process.env.NODE_ENV === 'development'
const https = require('https')
const electron = require('electron')
const config = require('./config')
const win32 = process.platform === 'win32'
const REGEX_ZIP_URL = /\/(v)?(\d+\.\d+\.\d+)\/.*\.zip/
const req = require('url').parse(config.GITHUB_RELEASE_API)
req.headers = { 'User-Agent': 'michealparks' }

if (process.platform === 'linux') {
  initLinux()
} else {
  initDarwinWin32()
}

function initLinux () {
  // autoupdating features don't exist...
}

function isValid (tag) {
  return tag.slice(1).split('.').length === 3
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

function isNewerVersionAvailable (latest) {
  const latestArr = latest.slice(1).split('.')
  const currentArr = config.APP_VERSION.slice(1).split('.')

  // Major version update
  if (Number(latestArr[0]) > Number(currentArr[0])) return true
  // Minor version update
  if (Number(latestArr[1]) > Number(currentArr[1])) return true
  // Patch update
  if (Number(latestArr[2]) > Number(currentArr[2])) return true
  // No update
  return false
}

function getFeedURL (tag, next) {
  return win32
    ? next(`${config.GITHUB_URL}/releases/download/${tag}`)
    : https.get(`${config.GITHUB_URL_RAW}/updater.json`, (res) => {
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
    }).on('error', next)
}

function check (next) {
  return getLatestTag((err, tag) => err
    ? next(err)
    : (!tag || !isValid(tag))
    ? next({ type: 'error', msg: 'Could not find a valid release tag.' })
    : !isNewerVersionAvailable(tag)
    ? next({ type: 'warn', msg: 'There is no newer version.' })
    : getFeedURL(tag, next))
}

function initDarwinWin32 () {
  const updater = electron.autoUpdater

  if (dev) {
    updater.on('error', e => console.error(e))
    updater.on('checking-for-update', e => console.log(e))
    updater.on('update-available', e => console.log(e))
    updater.on('update-not-available', e => console.log(e))
  }

  updater.on('update-downloaded', (msg) => {
    if (dev) console.log('update-downloaded', msg)
    return updater.quitAndInstall()
  })

  function onCheck (err, feedUrl) {
    if (err) return console.error(err)

    if (dev) console.log('feed-url', feedUrl)
    updater.setFeedURL(feedUrl)
    updater.checkForUpdates()
  }

  check(onCheck)

  return setInterval(() => check(onCheck), config.CHECK_UPDATE_INTERVAL)
}
