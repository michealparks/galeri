require('./on-link-click')
require('./tabs')
require('./prefs')
require('./locale')

document.getElementById('quit').onclick = () =>
  require('electron').remote.app.quit()

document.getElementById('about').onclick = () =>
  require('electron').ipcRenderer.send('open-about-window')

document.getElementById('favorited').onclick = () =>
  require('electron').ipcRenderer.send('open-favorites-window')
