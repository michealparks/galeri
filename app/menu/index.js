require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')
require('./locale')

const electron = require('electron')

document.getElementById('version').textContent = __VERSION__

document.getElementById('quit').onclick = function () {
  return electron.remote.app.quit()
}

document.getElementById('about').onclick = function () {
  return electron.ipcRenderer.send('open-about-window')
}

document.getElementById('favorites').onclick = function () {
  return electron.ipcRenderer.send('open-favorites-window')
}
