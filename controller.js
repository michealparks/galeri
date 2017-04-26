const ipc = require('electron').ipcRenderer
const { emit, on } = window

ipc.on('pause', function () {
  return emit('pause')
})

ipc.on('play', function () {
  return emit('play')
})

ipc.on('suspend', function () {
  return emit('suspend')
})

ipc.on('resume', function () {
  return emit('resume')
})

ipc.on('preferences-to-background', function (e, data) {
  return emit('preferences-to-background', data)
})

ipc.on('menubar-needs-preferences', function () {
  return emit('menubar-needs-preferences')
})

on('preferences-to-menubar', function (data) {
  return ipc.send('preferences-to-menubar', data)
})

on('artwork', function (data) {
  return ipc.send('artwork', data)
})

on('artwork-updated', function (data) {
  return ipc.send('artwork-updated')
})

on('browser-reset', function () {
  return ipc.send('browser-reset')
})

on('browser-rendered', function () {
  return ipc.send('browser-rendered')
})

ipc.send('background-loaded')
