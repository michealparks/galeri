function init () {
  const config = require('./config')

  require('electron').crashReporter.start({
    companyName: config.APP_TEAM,
    productName: config.APP_NAME,
    submitURL: config.CRASH_REPORT_URL
  })
}

module.exports = { init }
