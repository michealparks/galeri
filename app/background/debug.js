const { ipcRenderer } = require('electron')
const savedConsole = console

function noop () {}

if (process.env.NODE_ENV === 'production') {
  GlobalDebug(false, true)
}

window.GlobalDebug = GlobalDebug

window.addEventListener('error', e => {
  console.error(`Error propagated to window. This should not happen. Message: ${e}`)

  if (process.env.NODE_ENV === 'production') {
    // TODO: crash report
    return ipcRenderer.send('browser-reset')
  }
})

ipcRenderer.on('log', (e, data) =>
  data.args.forEach(arg => console[data.type]('main process: ', arg))
)

function GlobalDebug (debugOn, suppressAll = false) {
  try {
    if (!debugOn) {
      console = {}
      console.log = noop

      if (suppressAll) {
        console.info = console.warn = console.error = noop
      } else {
        console.info = savedConsole.info
        console.warn = savedConsole.warn
        console.error = savedConsole.error
      }
    } else {
      console = savedConsole
    }
  } catch (e) {}
}
