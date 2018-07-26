import electron from 'electron'
import {APP_TEAM, APP_NAME, CRASH_REPORT_URL} from '../../config'

const onFatalCrash = (e) => {
  console.error(e)
}

export const initCrashReporter = () => {
  electron.crashReporter.start({
    companyName: APP_TEAM,
    productName: APP_NAME,
    submitURL: CRASH_REPORT_URL
  })

  electron.app.on('gpu-process-crashed', onFatalCrash)
  process.on('uncaughtException', onFatalCrash)
}
