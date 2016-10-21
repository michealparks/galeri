const { app } = require('electron')

function init () {
  const config = require('./config')

  require('electron').crashReporter.start({
    companyName: config.APP_TEAM,
    productName: config.APP_NAME,
    submitURL: config.CRASH_REPORT_URL
  })
}

app.on('gpu-process-crashed', function () {
  console.error('gpu-process-crashed')
})

module.exports = { init }
