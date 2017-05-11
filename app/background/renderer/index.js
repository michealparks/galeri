module.exports = updateImage

const ipc = require('electron').ipcRenderer
const {get} = require('../util/storage')
const fill = require('./background')
const startTextLifecycle = require('./text')
const {getNextArtwork, saveConfig} = require('../museums-new')

let callbackRef
let imageCount = 0
let restartCount = 3
let updateRate = get('update-rate') ||
  require('../util/default-values').updateRate

ipc.on('menubar:update-rate', (e, rate) => {
  updateRate = rate
})

function updateImage (next) {
  callbackRef = next
  getNextArtwork(onGetArtwork)
}

function onGetArtwork (err, metadata) {
  if (err !== undefined) return handleError(err)

  ipc.send('background:artwork', metadata)

  fill(metadata, onImageFill)
  startTextLifecycle(metadata)
}

function onImageFill (err) {
  if (err !== undefined) return handleError(err)

  if (imageCount === 0) {
    ipc.send('background:rendered')
  }

  imageCount += 1

  if (imageCount === restartCount) {
    ipc.send('background:updated')
    return setTimeout(prepareExit, updateRate)
  }

  callbackRef()
}

function handleError (err) {
  if (err === 2 && !__dev__) {
    ipc.send('background:reset')
  } else {
    getNextArtwork(onGetArtwork)
  }
}

function prepareExit () {
  saveConfig()
  startTextLifecycle()
  ipc.send('background:reset')
}
