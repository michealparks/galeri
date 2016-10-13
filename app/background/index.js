require('buffer/')

const { ipcRenderer } = require('electron')
const fillBG = require('./fill-bg')
const { startTextLifecycle, toggleTextVisibility } = require('./text')
const { getNextImage, saveConfig } = require('../fetch-data')
const { seconds, minutes } = require('../util/time')
const updateImage = getNextImage.bind(null, onImageFetch)

let refreshRate = minutes(30)
let showTextOnDesktop = false
let imagesUntilRestart = 20
let isPaused = false
let imageCount = 0
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

window.addEventListener('online', () =>
  isOnline(online => online
    ? onConnectionRestored()
    : pollOnlineStatus(onConnectionRestored)))

window.addEventListener('offline', () =>
  onOnlineStatusChange())

ipcRenderer.on('pause', () => {
  console.log('pause')
  isPaused = true

  return clearTimeout(updateTimerId)
})

ipcRenderer.on('play', () => {
  console.log('play')
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

ipcRenderer.on('preferences', (e, data) => {
  showTextOnDesktop = data.showTextOnDesktop
  toggleTextVisibility(showTextOnDesktop)

  if (data.refreshRate !== refreshRate) {
    clearTimeout(updateTimerId)
    refreshRate = data.refreshRate

    return isPaused
      ? null
      : setTimeout(onOnlineStatusChange, getRemainingTime())
  }
})

ipcRenderer.send('request:preferences')

onOnlineStatusChange()

if (process.env.NODE_ENV === 'development') {
  window.nextImage = onOnlineStatusChange
}

function getRemainingTime () {
  return refreshRate - (Date.now() - lastUpdateTime) + totalSuspendTime
}

function onConnectionRestored () {
  updateTimerId = setTimeout(onOnlineStatusChange, getRemainingTime())
}

function isOnline (next) {
  return next(navigator.onLine)
}

function pollOnlineStatus (next) {
  return isOnline(online => online
    ? next()
    : setTimeout(() => pollOnlineStatus(next), seconds(1))
  )
}

function onOnlineStatusChange (forceReset) {
  return isOnline(online => {
    if (online) {
      clearTimeout(updateTimerId)
      updateTimerId = -1
      updateImage()
    } else {
      clearTimeout(updateTimerId)
      updateTimerId = -2
    }
  })
}

function onImageFetch (err, data) {
  if (err) {
    try {
      const { file, fn, errType, msg } = err

      if (errType === 'fatal' && process.env.NODE_ENV === 'production') {
        // TODO crash report
        return ipcRenderer.send('browser-reset')
      }

      if (process.env.NODE_ENV === 'development') {
        console[errType](`${file}, ${fn}: ${msg}`)
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`ISSUE WITH ERR MSG: ${e}, ${JSON.stringify(err)}`)
      }
    }

    return onOnlineStatusChange()
  }

  ipcRenderer.send('artwork', {
    source: data.source,
    href: data.href
  })

  return fillBG(data, onImageRender)
}

function onImageRender (data) {
  startTextLifecycle(data)

  if (imageCount === 0) {
    ipcRenderer.send('browser-rendered')
  }

  if (++imageCount === imagesUntilRestart) {
    updateTimerId = setTimeout(() => {
      startTextLifecycle()
      saveConfig(() => ipcRenderer.send('browser-reset'))
    }, refreshRate)
    return
  }

  if (updateTimerId === -2) {
    updateTimerId = -1
    return
  }

  totalSuspendTime = 0
  lastUpdateTime = Date.now()
  updateTimerId = setTimeout(updateImage, refreshRate)
}

