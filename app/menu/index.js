require('./on-link-click')
require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')
require('./locale')

document.getElementById('version').textContent = __VERSION__

document.getElementById('quit').onclick = function quitApp () {
  return require('electron').remote.app.quit()
}

document.getElementById('about').onclick = function openAbout () {
  return require('electron').ipcRenderer.send('open-about-window')
}
