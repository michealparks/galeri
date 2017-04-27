const ipc = require('electron').ipcRenderer
const fillBackground = require('../../core/src/js/renderer/background')

ipc.on('artwork', onArtwork)
ipc.once('artwork-to-clone', onArtwork)

function onArtwork (e, data) {
  fillBackground(data, function (err, data) {
    if (err) return
  })
}

ipc.send('background-clone-loaded')
