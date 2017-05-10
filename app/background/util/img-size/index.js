module.exports = validate

const detector = require('./detector')
const calculator = require('./calculator')
const {isNullUndefined} = require('../index')
const {screenWidth, screenHeight} = require('../screen')
const img = document.createElement('img')

let count = 0
let artworkRef, callbackRef, reader, buffer

img.onload = onload
img.onerror = onerror

function onError (e) {
  if (__dev__) console.warn('error validating image:', e)
  return callbackRef(1)
}

function onload () {
  artworkRef.naturalWidth = this.naturalWidth
  artworkRef.naturalHeight = this.naturalHeight

  if (artworkRef.naturalWidth < screenWidth() ||
      artworkRef.naturalHeight < screenHeight()) {
    return onError(`error validating image (size): ${artworkRef.naturalWidth}x${artworkRef.naturalHeight}`)
  }

  return callbackRef(undefined, artworkRef)
}

function onerror (e) {
  if (__dev__) console.warn('error validating image:', e)
  return callbackRef(1)
}

function onFetch (res) {
  if (isNullUndefined(res) || res.status !== 200) {
    if (__dev__) console.warn('error validating image:', 'status 404')
    return callbackRef(1)
  }

  count = 0
  buffer = new Uint8Array()
  reader = res.body.getReader()
  return search()
}

function getEntireImage () {
  img.src = artworkRef.img
}

function search () {
  count += 1

  if (count > 2) {
    reader.cancel('No metadata found.')
    return getEntireImage()
  }

  return reader.read().then(onRead)
}

function onRead (res) {
  let existing = buffer

  if (isNullUndefined(res.value)) {
    reader.cancel()
    return onError(res)
  }

  buffer = new Uint8Array(buffer.length + res.value.length)
  buffer.set(existing, 0)
  buffer.set(res.value, existing.length)

  const type = detector(buffer)

  // No supported format was found.
  if (res.done && type === undefined) {
    reader.cancel()
    return onError('no image format found')
  }

  // No format has been found... yet.
  if (type === undefined) return search()

  // Attempt to extract data
  const data = calculator[type](res.value)

  // No dimensional data could be found
  if (res.done && data === undefined) {
    reader.cancel()
    return onError('no dimensions found')
  }

  // No data has been found... yet.
  if (data === undefined) return search()

  // Data has been found, so close the stream.
  reader.cancel('No more reading needed.')

  // Check if the dimensions are satisfactory.
  if (data.width < screenWidth() || data.height < screenHeight()) {
    return onError(`Image dimensions are too small: ${data.width}x${data.height}`)
  }

  artworkRef.naturalWidth = data.width
  artworkRef.naturalHeight = data.height

  return callbackRef(undefined, artworkRef)
}

function timeout (resolve, reject) {
  return setTimeout(resolve, 7000)
}

function validate (artwork, next) {
  artworkRef = artwork
  callbackRef = next

  // Awkwardly set a timeout for the request
  Promise.race([
    new Promise(timeout),
    fetch(artwork.img, { cache: 'no-cache' })
  ])
    .then(onFetch)
    .catch(onError)
}
