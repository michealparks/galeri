const BGstyle = [
  document.getElementById('bg_0').style,
  document.getElementById('bg_1').style
]

const CL = document.getElementById('bg_1').classList

let i = 0
let cb, naturalWidth, naturalHeight

const preload = new window.Image()
preload.onload = onPreload
preload.onerror = onError

function onPreload () {
  i = (i + 1) % 2
  BGstyle[i].backgroundImage = `url("${preload.src}?${Date.now()}")`
  // Give a ms per pixel for rendering time
  setTimeout(onRender, naturalWidth > naturalHeight ? naturalWidth : naturalHeight)
}

function onRender () {
  CL.toggle('bg--active', i === 1)
  cb()
}

function onError (e) {
  cb(e)
}

function fillBG (config, callback) {
  naturalWidth = config.naturalWidth
  naturalHeight = config.naturalHeight
  cb = callback
  preload.src = `${config.img}?${Date.now()}`
}

module.exports = fillBG
