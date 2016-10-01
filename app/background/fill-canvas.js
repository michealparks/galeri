/* global Image */

let canvas
let ctx
let hasConfigured = false

const {
  devicePixelRatio = 1,
  innerWidth,
  innerHeight
} = window

let initCanvas = () => {
  canvas = [
    document.querySelector('#canvas_0'),
    document.querySelector('#canvas_1')
  ]

  ctx = [
    canvas[0].getContext('2d'),
    canvas[1].getContext('2d')
  ]

  canvas[0].width = canvas[1].width = innerWidth * devicePixelRatio
  canvas[0].height = canvas[1].height = innerHeight * devicePixelRatio
  hasConfigured = true
}

const fillCanvas = (src, i, callback) => {
  let img = new Image()

  img.onload = () => {
    const { naturalWidth, naturalHeight } = img
    const { width, height } = canvas[i]
    const imgRatio = naturalWidth / naturalHeight
    const canvasRatio = width / height

    if (imgRatio <= canvasRatio) {
      ctx[i].drawImage(
        img,
        0,
        0,
        width,
        Math.round(width / imgRatio)
        // 0,
        // 0,
        // width * 2,
        // Math.round(width / imgRatio) * 2
      )
    } else {
      ctx[i].drawImage(
        img,
        0,
        0,
        Math.round(height * imgRatio),
        height
        // 0,
        // 0,
        // Math.round(height * imgRatio) * 2,
        // height * 2
      )
    }

    window.requestAnimationFrame(callback)
  }

  img.src = src
}

module.exports = {
  initCanvas: () => hasConfigured ? null : initCanvas(),
  fillCanvas
}
