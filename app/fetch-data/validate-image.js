/**
 * Some sources don't provide image dimensions from their api, so before fetching
 * an image with unknown dimensions, we quickly stream the image until we can pick
 * out dimensions from the metadata, abort the request, and analyze the result
 */

const https = require('https')
const http = require('http')
const { headers } = require('../util/get')
const { parse } = require('url')
const sizeOf = require('image-size')

function validateImage (input, callback, dimensions) {
  let url = typeof input === 'string' ? input : input.url
  let options = parse(url)

  options.headers = headers

  const req = (options.protocol === 'http:' ? http : https).get(options, function (res) {
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

      if (width < (input.minWidth || (window.innerWidth * window.devicePixelRatio * 0.75)) ||
          height < (input.minHeight || (window.innerHeight * window.devicePixelRatio * 0.75))) {
        return callback('Too small!')
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
