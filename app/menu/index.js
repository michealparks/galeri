require('./on-link-click')
require('./tabs')
require('./artwork')
require('./prefs')
require('./locale')
require('./toggle-play')
require('./favorite')

const electron = require('electron')

document.getElementById('version').textContent = __VERSION__

document.getElementById('quit').onclick = () =>
  electron.remote.app.quit()

document.getElementById('about').onclick = () =>
  electron.ipcRenderer.send('open-about-window')

document.getElementById('favorited-artworks').onclick = () =>
  electron.ipcRenderer.send('open-favorites-window')
