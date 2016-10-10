const { ipcRenderer } = require('electron')
const ArtBlurb = document.getElementById('artwork-blurb')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')

ipcRenderer.on('artwork', function (e, data) {
  ArtBlurb.textContent = data.blurb
  ArtSource.textContent = data.source
  ArtLink.href = data.href
})
