const ipc = require('electron').ipcRenderer
const AppClassList = document.getElementById('app').classList
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const Title = document.getElementById('artwork-title')
const Text = document.getElementById('artwork-text')

let artwork

ipc.on('background:artwork', (e, data) => {
  artwork = data
  AppClassList.add('app--updating')
})

ipc.on('background:updated', () => {
  ArtSource.textContent = artwork.source
  ArtLink.href = artwork.href
  Title.textContent = truncate(artwork.title, 50)
  Text.textContent = truncate(artwork.text, 90)
  AppClassList.remove('app--updating')
})

function truncate (str, len) {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}
