/* global __VERSION__ */

require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')
require('./locale')

document.getElementById('version').textContent = __VERSION__
document.getElementById('quit').onclick = quitApp
document.getElementById('about').onclick = openAbout

function quitApp () {
  return require('electron').remote.app.quit()
}

function openAbout () {
  return require('electron').ipcRenderer.send('open-about-window')
}
