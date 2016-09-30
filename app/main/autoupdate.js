const electron = require('electron')
const updateCheckInterval = 1000 * 60 * 60 * 24

const init = () => process.platform === 'linux'
  ? initLinux()
  : initDarwinWin32()

const initLinux = () => {
  // autoupdating features don't exist yet...
}

const initDarwinWin32 = () => {
  const { autoUpdater } = electron

  autoUpdater.on('error', err => {
    console.error('error', err)
  })

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

  // autoUpdater.setFeedURL('url', ['header1'])
  //
  // autoUpdater.checkForUpdates()
  //
  // setInterval(autoUpdater.checkForUpdates, updateCheckInterval)
}

module.exports = init
