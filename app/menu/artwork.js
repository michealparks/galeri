const { ipcRenderer } = require('electron')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')

ipcRenderer.on('artwork', (e, data) => {
  console.log('ART!', data)
  ArtSource.textContent = data.source
  ArtLink.href = data.href
})
