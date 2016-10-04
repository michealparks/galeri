/* global Blob, createImageBitmap */
const { get } = require('https')
const { parse } = require('url')
const { headers } = require('../util/get')

let canvas = [
  document.querySelector('#canvas_0'),
  document.querySelector('#canvas_1')
]

let ctx = [
  canvas[0].getContext('2d'),
  canvas[1].getContext('2d')
]

canvas[0].width = canvas[1].width = window.innerWidth * window.devicePixelRatio
canvas[0].height = canvas[1].height = window.innerHeight * window.devicePixelRatio

const bufferChunksToBlob = data => {
  let len = 0
  for (let i = 0, l = data.length; i < l; ++i) {
    len += data[i].length
  }

  let offset = 0
  const result = new Uint8Array(len)

  for (let i = 0, l = data.length; i < l; ++i) {
    result.set(data[i], offset)
    offset += data[i].length
  }

  return new Blob([result])
}

const fillCanvas = ({ img, naturalWidth, naturalHeight }, i, callback) => {
  ctx[i].clearRect(0, 0, canvas.width, canvas.height)
  const { hostname, path } = parse(img)

  get({ hostname, path, headers }, res => {
    const data = []

    res.on('data', chunk => data.push(chunk))
    res.on('error', callback)
    res.on('end', () => {
      // let blob = new Blob([Buffer.concat(data)])
      createImageBitmap(bufferChunksToBlob(data)).then(bitmap => {
        // blob = null
        const { width, height } = canvas[i]
        const imgRatio = naturalWidth / naturalHeight
        const canvasRatio = width / height

        if (imgRatio <= canvasRatio) {
          const scaledHeight = Math.round(width / imgRatio)
          ctx[i].drawImage(bitmap, 0, -(scaledHeight - height) / 2, width, scaledHeight)
        } else {
          const scaledWidth = Math.round(height * imgRatio)
          ctx[i].drawImage(bitmap, -(scaledWidth - width) / 2, 0, scaledWidth, height)
        }

        bitmap = null
        window.requestAnimationFrame(callback)
      })
    })
  }).on('err', callback)
}

module.exports = fillCanvas
