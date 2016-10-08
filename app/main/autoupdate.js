const electron = require('electron')
const os = require('os').platform()
const { version } = require('../../package.json')
const { days } = require('../util/time')
const updateCheckInterval = days(2)

function init () {
  if (process.env.NODE_ENV === 'development') return

  return process.platform === 'linux'
    ? initLinux()
    : initDarwinWin32()
}

function initLinux () {
  // autoupdating features don't exist yet...
}

function initDarwinWin32 () {
  const { autoUpdater } = electron

  autoUpdater.on('error', console.error.bind(console))

  autoUpdater.on('checking-for-update', msg => {
    // console.log('checking-for-update', msg)
  })

  autoUpdater.on('update-available', msg => {
    // console.log('update-available', msg)
  })

  autoUpdater.on('update-not-available', msg => {
    // console.log('update-not-available', msg)
  })

  /*
    event Event
    releaseNotes String
    releaseName String
    releaseDate Date
    updateURL String
  */
  autoUpdater.on('update-downloaded', (...args) => {
    args.forEach(arg => {
      // console.log('update-downloaded', arg)
    })
  })

  autoUpdater.setFeedURL(os === 'darwin'
    ? `https://galeri.io/updates/latest/mac?v=${version}`
    : `https://galeri.io/releases/latest/win`)
  autoUpdater.checkForUpdates()
  setInterval(autoUpdater.checkForUpdates, updateCheckInterval)
}

module.exports = init
