const fs = require('fs')
const { knuthShuffle } = require('knuth-shuffle')
const { getImages } = require('./wikipedia')
const getProps = require('./get-props')

let cache
let unshuffledCache
let defaultConfig = '{"timestamp": null, "images": []}'

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
  fs.readFile('./images.json', 'utf8', (err, data) => {
    if (err) { /* we don't care! */ }

    data = JSON.parse(data || defaultConfig)
    const { images, timestamp } = data

    unshuffledCache = images
    cache = images.slice(0)
    knuthShuffle(cache)

    // if image array is older than 48 hours fetch new image data and store
    if (timestamp && Date.now() - timestamp < 1000 * 60 * 60 * 48) {
      console.log(cache, cache.pop())
      return callback(getNextImage)
    }

    getImages().then(images => {
      fs.writeFile('./images.json', JSON.stringify({
        timestamp: Date.now(),
        images: images.filter(image => !image.href.includes('undefined'))
      }), 'utf8')

      callback(getNextImage)
    })
  })
}

module.exports = init
