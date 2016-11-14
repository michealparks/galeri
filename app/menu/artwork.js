const ipc = require('electron').ipcRenderer
const Source = document.getElementById('source')
const Updating = document.getElementById('updating')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const ToggleBtn = document.getElementById('btn-toggle')

let cache

ipc.on('artwork', function (e, data) {
  cache = data

  Updating.classList.remove('hidden')
  Source.classList.add('hidden')
  ArtLink.classList.add('hidden')
  ToggleBtn.classList.add('hidden')
})

ipc.on('artwork-updated', function () {
  ArtSource.textContent = cache.source
  ArtLink.href = cache.href

  Updating.classList.add('hidden')
  Source.classList.remove('hidden')
  ArtLink.classList.remove('hidden')
  ToggleBtn.classList.remove('hidden')
})
