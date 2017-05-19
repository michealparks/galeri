const ipc = require('electron').ipcRenderer
const fillBackground = require('../background/renderer/background')

let currentHref

function onArtwork (e, data) {
  if (data.href !== currentHref) {
    fillBackground(data, onFill)
  }

  currentHref = data.href
}

function onFill () {}

ipc.on('background:artwork', onArtwork)
ipc.once('main:artwork', onArtwork)
ipc.send('clone:loaded')
