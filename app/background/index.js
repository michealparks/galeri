const { ipcRenderer, remote } = require('electron')
const App = require('./app')
const fillCanvas = require('./fill-canvas')
const getNextImage = require('../fetch-data')
const { assign } = Object

let lastUpdateTime
let refreshRate = 1000 * 20 // * 60 * 30
let updateTimerId = -1
let newTitle = ''
let newText = ''

const state = {
  activeIndex: null,
  description: '',
  descriptionPosition: 'left',
  shouldComponentUpdate: true
}

const update = newState => App(assign(state, newState))

const onOnlineStatusChange = () => {
  if (navigator.onLine) {
    updateTimerId = -1
    clearTimeout(updateTimerId)
    updateImage()
  } else {
    updateTimerId = -2
    clearTimeout(updateTimerId)
  }
}

const onImageFetch = (err, data) => {
  if (err) {
    console.error(err)
    return onOnlineStatusChange()
  }

  state.activeIndex = ((state.activeIndex || 0) + 1) % 2
  newTitle = data.title
  newText = data.text

  fillCanvas(data, state.activeIndex, () => {
    update({
      descriptionPosition: 'bottom'
    })

    setTimeout(onDescriptionHide, 800)
    setTimeout(onDescriptionReplace, 3510)

    if (updateTimerId === -2) {
      updateTimerId = -1
    } else {
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

const onDescriptionHide = () => {
  update({
    title: newTitle,
    text: newText,
    shouldDescriptionAnimate: false,
    descriptionPosition: 'left'
  })
}

const onDescriptionReplace = () => {
  update({
    descriptionPosition: '',
    shouldDescriptionAnimate: true
  })
}

window.addEventListener('online', onOnlineStatusChange)
window.addEventListener('offline', onOnlineStatusChange)

// cancel any data fetching if the computer is suspended
ipcRenderer.on('suspend', () => {
  updateTimerId = -2
  clearTimeout(updateTimerId)
})

ipcRenderer.on('resume', onOnlineStatusChange)

onOnlineStatusChange()

if (process.env.NODE_ENV === 'development') {
  window.nextImage = onOnlineStatusChange
}
