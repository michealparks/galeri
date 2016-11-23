const ipc = require('electron').ipcRenderer
const Source = document.getElementById('source')
const Updating = document.getElementById('updating')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const ToggleBtn = document.getElementById('btn-toggle')

let source, href

ipc.on('artwork', function (e, data) {
  source = data.source
  href = data.href

  Updating.classList.remove('hidden')
  Source.classList.add('hidden')
  ArtLink.classList.add('hidden')
  ToggleBtn.classList.add('hidden')
})

ipc.on('artwork-updated', function () {
  ArtSource.textContent = source
  ArtLink.href = href

  Updating.classList.add('hidden')
  Source.classList.remove('hidden')
  ArtLink.classList.remove('hidden')
  ToggleBtn.classList.remove('hidden')
})
