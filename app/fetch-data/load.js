const { get } = require('https')
const { parse } = require('url')
const sizeOf = require('image-size')

const validateImage = (url, callback, opts = parse(url), dimensions) => {
  const req = get({
    headers: {
      'cache-control': 'no-cache, no-store',
      'pragma-directive': 'no-cache',
      'cache-directive': 'no-cache',
      'pragma': 'no-cache',
      'expires': '0'
    },
    hostname: opts.hostname,
    path: opts.path
  }, res => {
    let buffer = Buffer.from([])
    let imageTypeDetectionError

    res.on('data', chunk => {
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
    .on('error', callback)
    .on('end', () => {
      if (!dimensions) {
        return callback(imageTypeDetectionError)
      }

      if (dimensions.width < 1000 || dimensions.height < 1000) {
        return callback('Too small!')
      }

      callback(null, url)
      buffer = null
    })
  }).on('error', callback)
}

module.exports = validateImage
