(function () {
  'use strict'

  const ipc = require('electron').ipcRenderer
  const { emit, on } = window

  ipc.on('preferences', function (e, data) {
    const prefs = {}

    if (data.hasOwnProperty('refreshRate')) {
      prefs.UPDATE_RATE = data.refreshRate
    }

    if (data.hasOwnProperty('showTextOnDesktop')) {
      prefs.IS_TITLE_SHOWN = data.showTextOnDesktop
    }

    return emit('preferences', prefs)
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
