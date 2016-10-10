const { ipcRenderer } = require('electron')
// const fillCanvas = require('./fill-canvas')
const fillBG = require('./fill-bg')
const { getNextImage, saveConfig } = require('../fetch-data')
const { minutes, seconds } = require('../util/time')
const updateImage = getNextImage.bind(null, onImageFetch)

const descriptionEl = document.getElementById('description')
const descriptionCL = descriptionEl.classList
const titleEl = descriptionEl.children[0]
const textEl = descriptionEl.children[1]

let refreshRate = seconds(10)
let imagesUntilRestart = 20

let imageCount = 0
let lastUpdateTime = 0
let startSuspendTime = 0
let totalSuspendTime = 0
let updateTimerId = -1
let title, text

window.addEventListener('error', function (e) {
  console.error(`Error propagated to window. This should not happen. Message: ${e}`)

  if (process.env.NODE_ENV === 'production') {
    // TODO: crash report
    return ipcRenderer.send('browser-reset')
  }
})

window.addEventListener('online', function () {
  const t = refreshRate - (Date.now() - lastUpdateTime) + totalSuspendTime
  updateTimerId = setTimeout(onOnlineStatusChange, t > 0 ? t : 0)
})

window.addEventListener('offline', function () {
  onOnlineStatusChange()
})

// cancel any data fetching if the computer is suspended
ipcRenderer.on('suspend', function () {
  startSuspendTime = Date.now()
  clearTimeout(updateTimerId)
  updateTimerId = -2
})

ipcRenderer.on('resume', function () {
  totalSuspendTime += (Date.now() - startSuspendTime)
  const t = refreshRate - (Date.now() - lastUpdateTime) + totalSuspendTime
  updateTimerId = setTimeout(onOnlineStatusChange, t > 0 ? t : 0)
})

onOnlineStatusChange()

if (process.env.NODE_ENV === 'development') {
  window.nextImage = onOnlineStatusChange
}

function onOnlineStatusChange () {
  if (navigator.onLine) {
    // this is just for safeguarding when doing funny testing things
    clearTimeout(updateTimerId)
    updateTimerId = -1
    updateImage()
  } else {
    clearTimeout(updateTimerId)
    updateTimerId = -2
  }
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
        console.error(`ISSUE WITH ERR MSG: ${e}, ${err}`)
      }
    }

    return onOnlineStatusChange()
  }

  title = data.title
  text = data.text
  fillBG(data, onFillCanvas)
}

function onFillCanvas () {
  setTimeout(onDescriptionHide)
  setTimeout(onDescriptionReplace, 800)
  setTimeout(onDescriptionShow, 2500)

  if (imageCount === 0) {
    ipcRenderer.send('browser-rendered')
  }

  if (++imageCount === imagesUntilRestart) {
    updateTimerId = setTimeout(function () {
      setTimeout(onDescriptionHide)
      saveConfig(function () { ipcRenderer.send('browser-reset') })
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

function onDescriptionHide () {
  descriptionCL.add('description--bottom')
}

function onDescriptionReplace () {
  titleEl.textContent = title
  textEl.textContent = text
  descriptionCL.add('no-transition', 'description--left')
  descriptionCL.remove('description--bottom')
}

function onDescriptionShow () {
  descriptionCL.remove('no-transition', 'description--left')
}

