const {ipcRenderer} = require('electron')
const fillBackground = require('../../core/src/js/renderer/background')

ipcRenderer.on('artwork', onArtwork)
ipcRenderer.once('artwork-to-clone', onArtwork)

function onArtwork (e, data) {
  fillBackground(data, onFill)
}

function onFill (err) {
  if (err) {}
}

ipcRenderer.send('background-clone-loaded')
