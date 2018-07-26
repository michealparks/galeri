import path from 'path'
import {app} from 'electron'

const run = (args, done) => {
  const exe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe')

  require('child_process')
    .spawn(exe, args, {detached: true})
    .on('close', done)
}

export const squirrelWin32 = (cmd) => {
  const target = path.basename(process.execPath)

  if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
    run(['--createShortcut=' + target + ''], app.quit)
    return true
  }
  if (cmd === '--squirrel-uninstall') {
    run(['--removeShortcut=' + target + ''], app.quit)
    return true
  }
  if (cmd === '--squirrel-obsolete') {
    app.quit()
    return true
  }

  return false
}
