const config = require('application-config')('galeri_images')
const { knuthShuffle } = require('knuth-shuffle')
const { getImages } = require('./wikipedia')
const getProps = require('./get-props')

let isConfigRead = false
let cache = []
let unshuffledCache = []
let defaultConfig = { timestamp: null, images: [] }

// TODO set timeout to update image array

let queue

// get stored images
const getNextImage = () => {
  if (!isConfigRead || !unshuffledCache.length) {
    return new Promise((rs, rj) => { queue = { rs, rj } })
  }

  if (!cache.length) {
    cache = knuthShuffle(unshuffledCache.slice(0))
  }

  return getProps(cache.pop())
}

config.read((err, data) => {
  isConfigRead = true

  if (err) { queue.rj(err) }

  const { images, timestamp } = data.length ? data : defaultConfig

  if (timestamp && Date.now() - timestamp < 1000 * 60 * 60 * 48) {
    unshuffledCache = images
    cache = knuthShuffle(unshuffledCache.slice(0))

    if (queue && unshuffledCache.length) return queue.rs(getNextImage())
  }

  // if image array is older than 48 hours fetch new image data and store
  getImages().then(images => {
    images = images.filter(image => !image.href.includes('undefined'))

    config.write({
      timestamp: Date.now(),
      images
    })

    unshuffledCache = images
    cache = knuthShuffle(unshuffledCache.slice(0))

    if (queue) queue.rs(getNextImage())
  })
})

module.exports = getNextImage
