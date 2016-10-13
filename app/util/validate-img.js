/**
 * Some sources don't provide image dimensions from their api, so before fetching
 * an image with unknown dimensions, we quickly stream the image until we can pick
 * out dimensions from the metadata, abort the request, and analyze the result
 */

const https = require('https')
const http = require('http')
const { parse } = require('url')
const sizeOf = require('image-size')

let req, url, next, buffer, dimensions, err, input

function onError (msg) {
  return next({
    errType: 'warn',
    file: 'util/validate-image.js',
    fn: 'validateImg()',
    msg
  })
}

function onData (chunk) {
  buffer = Buffer.concat([buffer, chunk])

  if (!dimensions) {
    try {
      dimensions = sizeOf(buffer)
      return req.abort()
    } catch (e) { err = e }
  }
}

function onEnd () {
  if (!dimensions) return next(err)

  const { width, height } = dimensions

  if (width < (input.minWidth || (window.innerWidth * window.devicePixelRatio * 0.75)) ||
      height < (input.minHeight || (window.innerHeight * window.devicePixelRatio * 0.75))) {
    return next({
      errType: 'warn',
      file: 'util/validate-image.js',
      fn: 'validateImg()',
      msg: 'Requested image is too small.'
    })
  }

  buffer = null

  return next(null, {
    url,
    naturalWidth: width,
    naturalHeight: height
  })
}

function onResponse (res) {
  buffer = Buffer.from([])
  dimensions = null

  return res
    .on('data', onData)
    .on('error', onError)
    .on('end', onEnd)
}

function validateImg (_input, _next) {
  err = null
  input = _input
  next = _next
  url = typeof input === 'string' ? input : input.url

  let options = parse(url)

  req = (options.protocol === 'http:' ? http : https)
    .get(options, onResponse)
    .on('error', onError)
}

module.exports = validateImg