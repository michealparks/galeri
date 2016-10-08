const { get } = require('https')
const { headers } = require('../util/get')
const { parse } = require('url')
const sizeOf = require('image-size')

function validateImage (url, callback, dimensions) {
  const { hostname, path } = parse(url)

  const req = get({ headers, hostname, path }, res => {
    let buffer = Buffer.from([])
    let imageTypeDetectionError

    res.on('data', function (chunk) {
      buffer = Buffer.concat([buffer, chunk])

      if (!dimensions) {
        try {
          dimensions = sizeOf(buffer)
          req.abort()
        } catch (e) {
          imageTypeDetectionError = e
        }
      }
    })
    .on('error', function (err) {
      callback(err, {})
    })
    .on('end', function () {
      if (!dimensions) {
        return callback(imageTypeDetectionError, {})
      }

      const { width, height } = dimensions

      if (width < window.innerWidth || height < window.innerHeight) {
        return callback('Too small!', {})
      }

      callback(null, {
        url,
        naturalWidth: width,
        naturalHeight: height
      })

      buffer = null
    })
  }).on('error', function (err) { callback(err, {}) })
}

module.exports = validateImage
