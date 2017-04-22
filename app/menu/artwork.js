const ipc = require('electron').ipcRenderer
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const Title = document.getElementById('artwork-title')
const Text = document.getElementById('artwork-text')
const SourceCL = document.getElementById('source').classList
const UpdatingCL = document.getElementById('updating').classList
const ToggleBtnCL = document.getElementById('btn-toggle').classList

const HIDDEN = 'hidden'

let source, href, title, text

ipc.on('artwork', function (e, data) {
  source = data.source
  href = data.href
  title = data.title
  text = data.text
  ArtLink.classList.add(HIDDEN)
  UpdatingCL.remove(HIDDEN)
  SourceCL.add(HIDDEN)
  ToggleBtnCL.add(HIDDEN)
})

ipc.on('artwork-updated', function () {
  ArtSource.textContent = source
  ArtLink.href = href
  Title.textContent = title
  Text.textContent = text
  ArtLink.classList.remove(HIDDEN)
  UpdatingCL.add(HIDDEN)
  SourceCL.remove(HIDDEN)
  ToggleBtnCL.remove(HIDDEN)
})
