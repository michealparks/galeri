/* global Image */
const React = require('react')
const { render } = require('react-dom')
const { ipcRenderer, remote } = require('electron')
const App = require('./app')
const getNextImage = require('../fetch-data')
const root = document.querySelector('#root')

let i = 0
let refreshRate = 10000
let updateTimerId = -1
let newDescription = ''

const state = {
  img_0: '',
  img_1: '',
  pos_0: '',
  pos_1: '',
  description: '',
  descriptionPosition: 'left',
  shouldComponentUpdate: true
}

const update = newState => render(
  <App index={ i } { ...Object.assign(state, newState) } />,
  root
)

const onOnlineStatusChange = () => {
  console.log(0)
  if (navigator.onLine) {
    updateTimerId = -1
    updateImage()
    console.log(1)
  } else {
    updateTimerId = -2
    clearTimeout(updateTimerId)
  }
}

const updateImage = () => {
  let count = 0
  const getImg = () => {
    if (++count !== 2) return

    getNextImage().then(onImageFetch).catch(err => {
      console.error(err)
      onOnlineStatusChange()
    })
  }

  const win = remote.getCurrentWindow().webContents

  win.clearHistory()
  win.session.clearCache(getImg)
  win.session.clearStorageData(getImg)
}

const onImageFetch = ({ img, content, position, height, width }) => {
  i = (i + 1) % 2
  newDescription = content

  let dummyImage = new Image()

  dummyImage.onload = () => {
    update({
      width,
      height,
      [`img_${i}`]: dummyImage.src,
      [`pos_${i}`]: position,
      descriptionPosition: 'bottom'
    })

    setTimeout(onDescriptionHide, 800)
    setTimeout(onDescriptionReplace, 800 + 200)
    setTimeout(onDescriptionShow, 6000 - 800 + 200)

    if (updateTimerId === -2) {
      updateTimerId = -1
    } else {
      updateTimerId = setTimeout(updateImage, refreshRate)
    }
  }

  dummyImage.src = img
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

const onDescriptionShow = () => {
  update({ [`img_${(i + 1) % 2}`]: '' })
}

window.addEventListener('online', onOnlineStatusChange)
window.addEventListener('offline', onOnlineStatusChange)

// cancel any data fetching if the computer is suspended
ipcRenderer.on('suspend', () => {
  updateTimerId = -2
  clearTimeout(updateTimerId)
})

ipcRenderer.on('next-image-request', onOnlineStatusChange)
ipcRenderer.on('resume', onOnlineStatusChange)

onOnlineStatusChange()
