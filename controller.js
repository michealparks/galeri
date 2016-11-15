(function () {
  'use strict'

  const ipc = require('electron').ipcRenderer
  const { emit, on } = window

  ipc.on('preferences', function (e, data) {
    return emit('preferences', data)
  })

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

  on('cached-preferences', function (data) {
    console.log(data)
    return ipc.send('cached-preferences', data)
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
})()
