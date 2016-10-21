// const isDarkMode = remote.systemPreferences.isDarkMode()

require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')

document.getElementById('version')
  .textContent = require('../../package.json').version

document.getElementById('quit')
  .onclick = () => require('electron').remote.app.quit()

document.getElementById('devtools')
  .onclick = () => require('electron').remote.BrowserWindow.getAllWindows()
    .forEach(win => win.openDevTools({ mode: 'detach' }))
