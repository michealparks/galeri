const { ipcRenderer, remote } = require('electron')
const App = require('./app')
const fillCanvas = require('./fill-canvas')
const getNextImage = require('../fetch-data')
const { minutes } = require('../util/time')
const { assign } = Object

let lastUpdateTime = 0
let startSuspendTime = 0
let totalSuspendTime = 0
let refreshRate = minutes(2)
let updateTimerId = -1

const state = {
  activeIndex: -1,
  description: '',
  descriptionPosition: 'left'
}

const update = newState => App(assign(state, newState))

const onOnlineStatusChange = () => {
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

const onImageFetch = (err, data) => {
  if (err) {
    console.error(err)
    return onOnlineStatusChange()
  }

  let newIndex = (state.activeIndex + 1) % 2

  fillCanvas(data, newIndex, () => {
    update({
      title: data.title,
      text: data.text,
      activeIndex: newIndex,
      descriptionPosition: 'bottom'
    })

    setTimeout(onDescriptionHide, 800)
    setTimeout(onDescriptionReplace, 2500)

    if (updateTimerId === -2) {
      updateTimerId = -1
    } else {
      totalSuspendTime = 0
      lastUpdateTime = Date.now()
      updateTimerId = setTimeout(updateImage, refreshRate)
    }
  })
}

const updateImage = () => {
  let count = 0
  const getImg = () => {
    if (++count !== 2) return

    getNextImage(onImageFetch)
  }

  try {
    const win = remote.getCurrentWindow().webContents
    win.clearHistory()
    win.session.clearCache(getImg)
    win.session.clearStorageData(getImg)
  } catch (e) {
    console.error('caught', e)
    getImg()
  }
}

const onDescriptionHide = () => update({
  descriptionPosition: 'left'
})

const onDescriptionReplace = () => update({
  descriptionPosition: ''
})

window.addEventListener('online', () => {
  const t = refreshRate - (Date.now() - lastUpdateTime) + totalSuspendTime
  updateTimerId = setTimeout(onOnlineStatusChange, t > 0 ? t : 0)
})

window.addEventListener('offline', () => {
  onOnlineStatusChange()
})

// cancel any data fetching if the computer is suspended
ipcRenderer.on('suspend', () => {
  startSuspendTime = Date.now()
  console.log('suspend', updateTimerId)
  clearTimeout(updateTimerId)
  updateTimerId = -2
})

ipcRenderer.on('resume', () => {
  totalSuspendTime += (Date.now() - startSuspendTime)
  const t = refreshRate - (Date.now() - lastUpdateTime) + totalSuspendTime
  updateTimerId = setTimeout(onOnlineStatusChange, t > 0 ? t : 0)
})

onOnlineStatusChange()

if (process.env.NODE_ENV === 'development') {
  window.nextImage = onOnlineStatusChange
}
