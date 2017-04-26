const { app } = require('electron')
const config = require('./config')

require('electron').crashReporter.start({
  companyName: config.APP_TEAM,
  productName: config.APP_NAME,
  submitURL: config.CRASH_REPORT_URL
})

function onFatalCrash (e) {
  console.error(e)
}

// TODO send crash report
app.on('gpu-process-crashed', onFatalCrash)
process.on('uncaughtException', onFatalCrash)
