const ipc = require('electron').ipcRenderer
const mediator = require('./core/src/js/util/mediator')

ipc.on('pause', function () {
  return mediator.emit('pause')
})

ipc.on('play', function () {
  return mediator.emit('play')
})

ipc.on('suspend', function () {
  return mediator.emit('suspend')
})

ipc.on('resume', function () {
  return mediator.emit('resume')
})

ipc.on('preferences-to-background', function (e, data) {
  return mediator.emit('preferences-to-background', data)
})

ipc.on('menubar-needs-preferences', function () {
  return mediator.emit('menubar-needs-preferences')
})

mediator.on('preferences-to-menubar', function (data) {
  return ipc.send('preferences-to-menubar', data)
})

mediator.on('artwork', function (data) {
  return ipc.send('artwork', data)
})

mediator.on('artwork-updated', function (data) {
  return ipc.send('artwork-updated')
})

mediator.on('browser-reset', function () {
  return ipc.send('browser-reset')
})

mediator.on('browser-rendered', function () {
  return ipc.send('browser-rendered')
})

mediator.on('background-loaded', function () {
  return ipc.send('background-loaded')
})
