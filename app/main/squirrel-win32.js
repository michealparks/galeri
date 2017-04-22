const path = require('path')
const app = require('electron').app
// var debug = require('debug')('windows-squirrel-startup')

function run (args, done) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe')

  if (__dev__) console.log('Spawning `%s` with args `%s`', updateExe, args)

  require('child_process').spawn(updateExe, args, {
    detached: true
  }).on('close', done)
}

function check (cmd) {
  if (__dev__) console.log('processing squirrel command `%s`', cmd)
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

module.exports = check
