/* global Worker */
const worker = new Worker('./background/worker.js')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let opacity, x, y, w, h, scaled
let naturalWidth, naturalHeight
let canvasRatio, imgRatio, bitmap

worker.onmessage = onGetNewImage

window.addEventListener('resize', onResize)
onResize()

function onResize () {
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio
  canvasRatio = canvas.width / canvas.height
}

function tick (t) {
  if (opacity > 400) {
    bitmap = null
    return
  }

  window.requestAnimationFrame(tick)

  ctx.globalAlpha = ++opacity / 400
  ctx.drawImage(bitmap, x, y, w, h)
}

function onGetNewImage (msg) {
  bitmap = msg.data
  imgRatio = naturalWidth / naturalHeight

  if (imgRatio <= canvasRatio) {
    scaled = Math.round(canvas.width / imgRatio)
    x = 0
    y = -(scaled - canvas.height) / 2
    w = canvas.width
    h = scaled
  } else {
    scaled = Math.round(canvas.height * imgRatio)
    x = -(scaled - canvas.width) / 2
    y = 0
    w = scaled
    h = canvas.height
  }

  opacity = 0

  window.requestAnimationFrame(tick)
}

function fillCanvas (config, callback) {
  naturalWidth = config.naturalWidth
  naturalHeight = config.naturalHeight

  worker.postMessage(config.img)
  callback()
}

module.exports = fillCanvas
