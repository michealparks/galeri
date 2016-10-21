require('buffer/')
const { ipcRenderer } = require('electron')
const fillBG = require('./fill-bg')
const { startTextLifecycle, toggleTextVisibility } = require('./text')
const { getNextImage, saveConfig } = require('../fetch-data')
const { minutes } = require('../util/time')
const { clamp } = require('../util/math')
const updateImage = getNextImage.bind(null, onImageFetch)

let refreshRate = minutes(30)
let imageCount = 0
let imagesUntilRestart = 20
let isPaused = false

let lastUpdateTime = Date.now()
let startSuspendTime = 0
let totalSuspendTime = 0
let updateTimerId = -1

window.addEventListener('error', e => {
  console.error(`Error propagated to window. This should not happen. Message: ${e}`)

  if (process.env.NODE_ENV === 'production') {
    // TODO: crash report
    return ipcRenderer.send('browser-reset')
  }
})

window.addEventListener('online', onOnlineStatusChange)
window.addEventListener('offline', onOnlineStatusChange)

ipcRenderer.on('log', (e, data) =>
  data.args.forEach(arg => console[data.type]('main process: ', arg)))

ipcRenderer.on('pause', () => {
  isPaused = true
  return clearTimeout(updateTimerId)
})

ipcRenderer.on('play', () => {
  isPaused = false
  updateTimerId = setTimeout(onOnlineStatusChange, getRemainingTime())
})

// cancel any data fetching if the computer is suspended
ipcRenderer.on('suspend', () => {
  startSuspendTime = Date.now()
  clearTimeout(updateTimerId)
  updateTimerId = -2
})

ipcRenderer.on('resume', () => {
  totalSuspendTime += (Date.now() - startSuspendTime)

  if (isPaused) return
  updateTimerId = setTimeout(onOnlineStatusChange, getRemainingTime())
})

ipcRenderer.on('preferences', onGetPreferences)

ipcRenderer.send('request:preferences')

onOnlineStatusChange()

if (process.env.NODE_ENV === 'development') {
  window.nextImage = onOnlineStatusChange
}

function onOnlineStatusChange () {
  // Kill any future fetches
  clearTimeout(updateTimerId)

  if (navigator.onLine && !isPaused) {
    // Allow the lifecycle to complete a full round
    updateTimerId = -1

    // Kick off the lifecycle
    updateImage()
  } else {
    // If we're in mid-lifecycle, don't allow it to finish
    updateTimerId = -2
  }
}

function onGetPreferences (e, data) {
  // we don't need to persist this data to memory since it's just a toggle
  toggleTextVisibility(data.showTextOnDesktop)

  if (data.refreshRate === refreshRate) return
  clearTimeout(updateTimerId)
  refreshRate = data.refreshRate

  if (!isPaused) {
    updateTimerId = setTimeout(onOnlineStatusChange, getRemainingTime())
  }
}

function getRemainingTime () {
  // time until next fetch minus the amount of time elapsed since last fetch
  // time while suspended is given back to the time until next fetch
  return refreshRate - (Date.now() - lastUpdateTime) + clamp(totalSuspendTime, 0, Date.now() - lastUpdateTime)
}

function interpretErrorAndRestart (err) {
  try {
    // An unrecoverable whoopsie-daisy
    if (err.errType === 'fatal' && process.env.NODE_ENV === 'production') {
      // TODO crash report
      return ipcRenderer.send('browser-reset')
    }

    if (process.env.NODE_ENV === 'development') {
      console[err.errType](`${err.file}, ${err.fn}: ${err.msg}`)
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`ISSUE WITH ERR MSG: ${e}, ${JSON.stringify(err)}`)
    }
  }

  return onOnlineStatusChange()
}

function onImageFetch (err, data) {
  if (err) return interpretErrorAndRestart(err)

  ipcRenderer.send('artwork', {
    source: data.source,
    href: data.href
  })

  return fillBG(data, onImageRender)
}

function onImageRender (err, data) {
  if (err) return interpretErrorAndRestart(err)

  startTextLifecycle(data)

  if (imageCount === 0) ipcRenderer.send('browser-rendered')

  if (++imageCount >= imagesUntilRestart) {
    return setTimeout(() => {
      startTextLifecycle()
      saveConfig(() => ipcRenderer.send('browser-reset'))
    }, refreshRate)
  }

  if (updateTimerId === -2 || isPaused) {
    updateTimerId = -1
    return
  }

  totalSuspendTime = 0
  lastUpdateTime = Date.now()
  updateTimerId = setTimeout(updateImage, refreshRate)
}
