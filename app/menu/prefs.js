const path = require('path')
const electron = require('electron')
const ipc = electron.ipcRenderer
const LabelLocationBtn = document.getElementById('label-location')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')
const FavoriteBtn = document.getElementById('btn-favorite')
const PlayPauseBtn = document.getElementById('btn-toggle')
const AppClassList = document.getElementById('app').classList
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')
const Title = document.getElementById('artwork-title')
const Text = document.getElementById('artwork-text')
const appPath = process.platform.indexOf('win32') !== -1
  ? path.resolve(path.dirname(process.execPath), '..', 'Update.exe')
  : process.execPath
const startArgs = process.platform.indexOf('win32') !== -1
  ? [
    '--processStart', `"${path.basename(process.execPath)}"`,
    '--process-start-args', `"--hidden"`
  ]
  : undefined

let isFavorited = false
let isPaused = false

ipc.on('background:artwork', (e, artwork) => {
  toggleFavorite(artwork.isFavorited || false)
  ArtSource.textContent = artwork.source
  ArtLink.href = artwork.href
  Title.textContent = truncate(artwork.title, 50)
  Text.textContent = truncate(artwork.text, 90)
  AppClassList.remove('app--updating')
})

ipc.on('background:label-location', (e, location) => {
  LabelLocationBtn.value = location
})

ipc.on('background:update-rate', (e, rate) => {
  UpdateRateBtn.value = rate
})

ipc.on('background:is-paused', (e, paused) =>
  togglePlay(paused))

ipc.on('favorites:delete', () => {
  toggleFavorite(false)
})

ipc.send('menubar:loaded')

LabelLocationBtn.onchange = (e) =>
  ipc.send('menubar:label-location', e.currentTarget.value)

UpdateRateBtn.onchange = (e) =>
  ipc.send('menubar:update-rate', Number(e.currentTarget.value))

AutolaunchBtn.onclick = (e) =>
  electron.remote.app.setLoginItemSettings({
    openAtLogin: e.currentTarget.checked,
    path: appPath,
    args: startArgs
  }, appPath, startArgs)

FavoriteBtn.onclick = () => {
  toggleFavorite(!isFavorited)
  ipc.send('menubar:is-favorited', isFavorited)
}

PlayPauseBtn.onclick = () => {
  togglePlay(!isPaused)
  ipc.send('menubar:is-paused', isPaused)
}

setTimeout(() => {
  AutolaunchBtn.checked = electron.remote.app.getLoginItemSettings({
    path: appPath
  }).openAtLogin
}, 500)

function toggleFavorite (flag) {
  isFavorited = flag
  FavoriteBtn.classList.toggle('btn-favorite--active', isFavorited)
}

function togglePlay (flag) {
  isPaused = flag
  PlayPauseBtn.classList.toggle('btn-toggle--paused', isPaused)
}

function truncate (str, len) {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}
