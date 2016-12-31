require('./chromecast')
require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')

document
  .getElementById('version')
  .textContent = require('../../package.json').version

document.getElementById('quit').onclick = function () {
  return require('electron').remote.app.quit()
}

document.getElementById('about').onclick = function () {
  return require('electron').ipcRenderer.send('open-about-window')
}
