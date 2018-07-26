import {ipcRenderer as ipc} from 'electron'
import {
  enableAutolaunch,
  disableAutolaunch,
  isAutolaunchEnabled
} from './autolaunch'

const LabelLocationBtn = document.getElementById('label-location')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')
const FavoriteBtn = document.getElementById('btn-favorite')
const PlayPauseBtn = document.getElementById('btn-toggle')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const Title = document.getElementById('artwork-title')
const Text = document.getElementById('artwork-text')

let isFavorited = false
let isPaused = false

const toggleFavorite = (flag) => {
  isFavorited = flag
  FavoriteBtn.classList.toggle('active', isFavorited)
}

const togglePlay = (flag) => {
  isPaused = flag
  PlayPauseBtn.classList.toggle('paused', isPaused)
}

const truncate = (str, len) => {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}

if (__linux__) {
  document.body.classList.add('linux')
}

ipc.on('update-available', (e, version) => {
  document.body.classList.add('update-message')
})

ipc.on('new-artwork', (e, artwork) => {
  toggleFavorite(artwork.isFavorited || false)
  ArtSource.textContent = artwork.source
  ArtLink.href = artwork.href
  Title.textContent = truncate(artwork.title, 50)
  Text.textContent = truncate(artwork.text, 90)
})

ipc.on('label-location-changed', (e, location) => {
  LabelLocationBtn.value = location
})

ipc.on('update-rate-changed', (e, rate) => {
  UpdateRateBtn.value = rate
})

ipc.on('pause', (e, paused) => {
  return togglePlay(paused)
})

ipc.on('toggle-favorite', (e, isFavorited) => {
  return toggleFavorite(false)
})

ipc.send('menu-loaded')

LabelLocationBtn.onchange = (e) => {
  return ipc.send('label-location-changed', e.currentTarget.value)
}

UpdateRateBtn.onchange = (e) => {
  return ipc.send('update-rate-changed', Number.parseInt(e.currentTarget.value, 10))
}

AutolaunchBtn.onclick = (e) => {
  return e.currentTarget.checked
    ? enableAutolaunch()
    : disableAutolaunch()
}

FavoriteBtn.onclick = () => {
  toggleFavorite(!isFavorited)

  return ipc.send('toggle-favorite', isFavorited)
}

PlayPauseBtn.onclick = () => {
  togglePlay(!isPaused)

  return ipc.send('pause', isPaused)
}

setTimeout(() => isAutolaunchEnabled(isEnabled => {
  AutolaunchBtn.checked = isEnabled
}), 500)
