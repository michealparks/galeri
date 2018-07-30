import electron from 'electron'

document.getElementById('copyright').textContent = (
  `Copyright © 2016 - ${new Date().getFullYear()} Space Egg LLC`
)

document.getElementById('version').textContent = __VERSION__

document.getElementById('galeri').ondragstart = () => {
  return false
}

document.getElementById('devtools').onclick = () => {
  const windows = electron.remote.BrowserWindow.getAllWindows()

  for (let i = 0, l = windows.length; i < l; i++) {
    windows[i].openDevTools({ mode: 'detach' })
  }
}

document.getElementById('reset').onclick = () => {
  return electron.ipcRenderer.send('reset-all-data')
}
