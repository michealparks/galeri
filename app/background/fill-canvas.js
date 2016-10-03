let canvas = []
let ctx = []
let hasConfigured = false

const headers = new window.Headers({
  'cache-control': 'no-cache, no-store',
  'pragma-directive': 'no-cache',
  'cache-directive': 'no-cache',
  'pragma': 'no-cache',
  'expires': '0'
})

let initCanvas = () => {
  canvas[0] = document.querySelector('#canvas_0')
  canvas[1] = document.querySelector('#canvas_1')

  ctx[0] = canvas[0].getContext('2d')
  ctx[1] = canvas[1].getContext('2d')

  canvas[0].width = canvas[1].width = window.innerWidth * window.devicePixelRatio
  canvas[0].height = canvas[1].height = window.innerHeight * window.devicePixelRatio
  hasConfigured = true
}

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

      return callback()
    })
    .catch(callback)

module.exports = {
  initCanvas: () => hasConfigured ? null : initCanvas(),
  fillCanvas
}
