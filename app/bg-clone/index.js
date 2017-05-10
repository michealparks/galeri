const ipc = require('electron').ipcRenderer
const fillBackground = require('../background/renderer/background')

function onArtwork (e, data) {
  fillBackground(data, onFill)
}

function onFill () {}

ipc.on('background:artwork', onArtwork)
ipc.once('main:artwork', onArtwork)
ipc.send('clone:loaded')
