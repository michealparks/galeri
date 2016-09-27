const config = require('application-config')('galeri_images')
const { knuthShuffle } = require('knuth-shuffle')
const { getImages } = require('./wikipedia')
const getProps = require('./get-props')

let cache
let unshuffledCache
let defaultConfig = { timestamp: null, images: [] }

// TODO set timeout to update image array

// get stored images
const getNextImage = () => {
  if (!cache.length) {
    cache = knuthShuffle(unshuffledCache.slice(0))
  }

  const nextImage = cache.pop()

  return getProps(nextImage).catch(() => getNextImage())
}

const init = callback => {
  config.read((err, data) => {
    if (err) { /* we don't care! */ }

    const { images, timestamp } = data.length ? data : defaultConfig

    unshuffledCache = images
    cache = images.slice(0)
    knuthShuffle(cache)

    // if image array is older than 48 hours fetch new image data and store
    if (timestamp && Date.now() - timestamp < 1000 * 60 * 60 * 48) {
      return callback(getNextImage)
    }

    getImages().then(images => {
      images = images.filter(image => !image.href.includes('undefined'))

      config.write({
        timestamp: Date.now(),
        images
      })

      unshuffledCache = images
      cache = images.slice(0)
      knuthShuffle(cache)

      callback(getNextImage)
    })
  })
}

module.exports = init
