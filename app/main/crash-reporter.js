const electron = require('electron')
const config = require('../../config')

electron.crashReporter.start({
  companyName: config.APP_TEAM,
  productName: config.APP_NAME,
  submitURL: config.CRASH_REPORT_URL
})

function onFatalCrash (e) {
  console.error(e)
}

// TODO send crash report
electron.app.on('gpu-process-crashed', onFatalCrash)
process.on('uncaughtException', onFatalCrash)
