require('../globals')

if (__dev__) {
  console.time('init')
  // try { require('electron-reloader')(module) } catch (err) {}
}

const electron = require('electron')
const initDisplays = require('./displays')
const initMenubar = require('./menubar')
const initProvider = require('../museums')
const {app} = electron

let shouldQuit = false

const onFatalCrash = (e) => {
  console.error(e.stack)
}

// TODO send crash report
app.on('gpu-process-crashed', onFatalCrash)
process.on('uncaughtException', onFatalCrash)

// Handle restart due to windows updates
if (__win32__) {
  shouldQuit = require('./app/main/squirrel-win32')(process.argv[1])
}

// Handle possible other instances of the app
if (!shouldQuit) {
  shouldQuit = app.makeSingleInstance(() => {})
  if (shouldQuit) app.quit()
}

if (!shouldQuit) {
  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('js-flags', '--use_strict')

  // Hide the app from the MacOS dock
  // if (app.dock !== undefined) app.dock.hide()

  app.once('ready', () => {
    initProvider(electron.screen)
    // initDisplays()
    initMenubar()
  })
}
