import electron from 'electron'

document.getElementById('galeri').ondragstart = () => false

document.getElementById('copyright').textContent = (
  `Copyright © 2016 - ${new Date().getFullYear()} Space Egg LLC`
)

document.getElementById('version').textContent = __VERSION__

document.getElementById('devtools').onclick = () => (
  electron.remote.BrowserWindow.getAllWindows()
    .forEach(win => win.openDevTools({ mode: 'detach' }))
)

document.getElementById('reset').onclick = () => (
  electron.ipcRenderer.send('reset-all-data')
)
