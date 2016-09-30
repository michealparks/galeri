const https = require('https')
const url = require('url')
const sizeOf = require('image-size')

const loadImage = imgUrl => new Promise((res, rej) => {
  let dimensions
  const { hostname, path } = url.parse(imgUrl)

  const req = https.get({
    headers: {
      'cache-control': 'no-cache, no-store',
      'pragma-directive': 'no-cache',
      'cache-directive': 'no-cache',
      'pragma': 'no-cache',
      'expires': '0'
    },
    hostname,
    path
  }, response => {
    let buffer = Buffer.from([])

    let imageTypeDetectionError

    response.on('data', chunk => {
      buffer = Buffer.concat([buffer, chunk])

      if (!dimensions) {
        try {
          dimensions = sizeOf(buffer)

          if (dimensions.width < 1000 || dimensions.height < 1000) {
            rej('Too small!')
          }
          req.abort()
        } catch (e) {
          imageTypeDetectionError = e
        }
      }
    })
    .on('error', (err) => rej(err))
    .on('end', () => {
      if (!dimensions) return rej(imageTypeDetectionError)

      res({
        url: imgUrl,
        // url: URL.createObjectURL(new Blob([buffer], { 'type': 'image/jpeg;charset=utf-8' })),
        height: dimensions.height,
        width: dimensions.width
      })

      buffer = null
    })
  })

  req.on('error', err => rej(err))
})

module.exports = loadImage
