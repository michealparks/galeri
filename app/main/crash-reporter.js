import electron from 'electron'
import {APP_TEAM, APP_NAME, CRASH_REPORT_URL} from '../../config'

if (__dev__) console.time('init')

global.eval = () => console.error('NO EVAL')

electron.crashReporter.start({
  companyName: APP_TEAM,
  productName: APP_NAME,
  submitURL: CRASH_REPORT_URL
})

const onFatalCrash = (e) => console.error(e)

// TODO send crash report
electron.app.on('gpu-process-crashed', onFatalCrash)
process.on('uncaughtException', onFatalCrash)
