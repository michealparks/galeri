'use strict'

require('../globals')

const {ipcRenderer} = require('electron')
const [bg0, bg1, description] = document.body.children
const bgStyle = [bg0.style, bg1.style]
const bgClass = [bg0.classList, bg1.classList]
const img = document.createElement('img')

let i = 0

/**
 * Sets background image source
 */
const onNewImage = (e, {imgsrc, localsrc, text}) => {
  img.src = localsrc
}

const onload = ({currentTarget}) => {
  const width = currentTarget.naturalWidth
  const height = currentTarget.naturalHeight

  i ^= 1
  bgClass[i].toggle('vertical', height > width)
  bgStyle[i].backgroundImage = `url("${currentTarget.src}")`

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showImage, width > height ? width / 1.5 : height / 1.5)
}

const onerror = (e) => {
  if (__dev__) console.warn('image loading error', e)
  ipcRenderer.send('background:imgerror')
}

const showImage = () => {
  bgClass[1].toggle('active', i === 1)
  ipcRenderer.send('background:rendered')
  setTimeout(deleteImageRef, 4000, i ^ 1)
}

const deleteImageRef = (i) => {
  bgStyle[i].removeProperty('background-image')
}

img.onload = onload
img.onerror = onerror
ipcRenderer.on('main:artwork', onNewImage)
ipcRenderer.send('background:loaded')
