document.getElementById('img').ondragstart = () => false

document.getElementById('copyright').textContent = (
  `Copyright © 2016 - ${new Date().getFullYear()} Space Egg LLC`
)

document.getElementById('version').textContent = __VERSION__

document.getElementById('devtools').onclick = () => {
  for (let i = 0, w = require('electron').remote.BrowserWindow.getAllWindows(), l = w.length; i < l; ++i) {
    w[i].openDevTools({ mode: 'detach' })
  }
}

document.getElementById('reset').onclick = () =>
  require('electron').ipcRenderer.send('reset-all-data')
