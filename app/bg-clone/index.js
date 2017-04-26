const ipc = require('electron').ipcRenderer
const fillBackground = require('../../core/src/js/renderer/background')

ipc.on('artwork', function (e, data) {
  fillBackground(data, function (err, data) {
    if (err) return
  })
})

ipc.send('background-clone-loaded')
