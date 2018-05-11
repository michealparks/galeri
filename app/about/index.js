window.galeri.ondragstart = () => false

window.version.textContent = __VERSION__

window.copyright.textContent =
  `Copyright © 2016 - ${new Date().getFullYear()} Space Egg LLC`

window.devtools.onclick = () =>
  require('electron').remote.BrowserWindow.getAllWindows()
    .forEach(win => win.openDevTools({ mode: 'detach' }))

window.reset.onclick = () =>
  require('electron').ipcRenderer.send('reset-all-data')
