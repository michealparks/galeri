import './boilerplate'
import electron, {app} from 'electron'
import {initAutoUpdate} from './auto-update'
import {initCrashReporter} from './crash-reporter'
import {squirrelWin32} from './squirrel-win32'
import {menu} from './windows/menu'
import {initLifecycle} from './lifecycle'
import {initAppState} from './state'

if (!__win32__ || !squirrelWin32(process.argv[1])) {
  initCrashReporter()
  initAutoUpdate()

  app.requestSingleInstanceLock()
  app.on('second-instance', () => {})

  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('js-flags', '--use_strict')

  // This is appended due to a chromium bug that disables transparent
  // windows on linux. Peridically check to see if it can be removed.
  if (__linux__) {
    app.commandLine.appendSwitch('enable-transparent-visuals')
    app.commandLine.appendSwitch('disable-gpu')
  }

  // Hide the app from the MacOS dock
  if (app.dock !== undefined) app.dock.hide()

  app.on('ready', async () => {
    menu(electron.screen)

    await initAppState()

    initLifecycle(electron.powerMonitor)
  })
}
