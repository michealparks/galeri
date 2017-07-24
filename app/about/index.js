document.getElementById('img').ondragstart = () => false

document.getElementById('copyright').textContent = (
  `Copyright © 2016 - ${new Date().getFullYear()} Space Egg LLC`
)

document.getElementById('version').textContent = __VERSION__

document.getElementById('devtools').onclick = () => (
  require('electron').remote.BrowserWindow.getAllWindows()
    .forEach(win =>
      win.openDevTools({ mode: 'detach' })
    )
)

document.getElementById('reset').onclick = () => (
  require('electron').ipcRenderer.send('reset-all-data')
)
