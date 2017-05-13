const AutoLaunch = require('auto-launch')
const electron = require('electron')

module.exports = new AutoLaunch({
  name: 'Galeri',
  // On Mac, work around a bug in auto-launch where it opens a Terminal window
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  path: electron.app.getPath('exe').split('.app/Content')[0] + '.app',
  isHidden: false
})
