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

const headers = new window.Headers({
  'cache-control': 'no-cache, no-store',
  'pragma-directive': 'no-cache',
  'cache-directive': 'no-cache',
  'pragma': 'no-cache',
  'expires': '0'
})

const fillCanvas = ({ img, naturalWidth, naturalHeight }, i, callback) =>
  window.fetch(img, { headers, cache: 'no-store' })
    .then(res => res.blob())
    .then(res => window.createImageBitmap(res))
    .then(bitmap => {
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
    .catch(callback)

module.exports = fillCanvas
