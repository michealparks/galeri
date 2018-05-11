const ipc = require('electron').ipcRenderer
const updateImage = require('../background/renderer/background')

let currentHref

function onArtwork (e, data) {
  if (data.href !== currentHref) {
    updateImage(data)
  }

  currentHref = data.href
}

ipc.on('background:artwork', onArtwork)
ipc.once('main:artwork', onArtwork)
ipc.send('clone:loaded')
