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
  console.log('INIT')
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
  const img = new Image()

  img.onload = () => {
    const { naturalWidth, naturalHeight } = img
    const { width, height } = canvas[i]

    // landscape is smaller than screen
    if (naturalWidth > naturalHeight &&
        naturalHeight < height) {
      ctx[i].drawImage(
        img,
        -(naturalWidth - width) / 2,
        0,
        (height - naturalHeight) + naturalWidth,
        height
      )
    // landscape is larger than screen
    } else if (naturalWidth > naturalHeight &&
               naturalHeight >= height) {
      ctx[i].drawImage(
        img,
        0,
        -(naturalHeight - height) / 2,
        width,
        (Math.abs(width - naturalWidth) *
        naturalWidth > width ? -1 : 1) + naturalHeight
      )
    // portrait
    } else {
      ctx[i].drawImage(
        img,
        0,
        -width / 4,
        width,
        naturalHeight + (width - naturalWidth)
      )
    }

    callback()
  }

  img.src = src
}

module.exports = {
  initCanvas: () => hasConfigured ? null : initCanvas(),
  fillCanvas
}
