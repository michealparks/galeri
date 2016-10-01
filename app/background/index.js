const React = require('react')
const { render } = require('react-dom')
const { ipcRenderer, remote } = require('electron')
const App = require('./app')
const { initCanvas, fillCanvas } = require('./fill-canvas')
const getNextImage = require('../fetch-data')
const root = document.querySelector('#root')

let lastUpdateTime
let refreshRate = 1000 * 60 * 30
let updateTimerId = -1
let newDescription = ''

const state = {
  activeIndex: null,
  description: '',
  descriptionPosition: 'left',
  shouldComponentUpdate: true
}

render(<App {...state} />, root, initCanvas)

const update = newState => render(
  <App {...Object.assign(state, newState)} />,
  root
)

const onOnlineStatusChange = () => {
  if (navigator.onLine) {
    updateTimerId = -1
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
  newDescription = data.content

  fillCanvas(data.img, state.activeIndex, () => {
    update({
      descriptionPosition: 'bottom'
    })

    setTimeout(onDescriptionHide, 800)
    setTimeout(onDescriptionReplace, 800 + 200)

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

  const win = remote.getCurrentWindow().webContents

  win.clearHistory()
  win.session.clearCache(getImg)
  win.session.clearStorageData(getImg)
}

const onDescriptionHide = () => {
  update({
    description: newDescription,
    shouldDescriptionAnimate: false,
    descriptionPosition: 'left'
  })
  newDescription = null
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
  console.log('suspend')
  updateTimerId = -2
  clearTimeout(updateTimerId)
})

ipcRenderer.on('resume', onOnlineStatusChange)

onOnlineStatusChange()
