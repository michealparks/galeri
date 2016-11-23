// const isDarkMode = remote.systemPreferences.isDarkMode()

require('./chromecast')
require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')

document.getElementById('version').textContent = require('../../package.json').version

document.getElementById('quit').onclick = function () {
  return require('electron').remote.app.quit()
}

document.getElementById('devtools').onclick = function () {
  const wins = require('electron').remote.BrowserWindow.getAllWindows()
  for (let i = 0, l = wins.length; i < l; ++i) {
    wins[i].openDevTools({ mode: 'detach' })
  }
}
