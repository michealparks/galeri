const { load } = require('cheerio')
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const get = require('../util/get')
const { days } = require('../util/time')
const wikiUrl = 'https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures/Artwork'

let hasInit = false
let cache = []
let queue

function getWikiConfig () {
  return {
    cache,
    timestamp: Date.now()
  }
}

function giveWikiConfig (config) {
  hasInit = true

  if (Date.now() - (config.timestamp || days(3)) < days(2)) {
    cache = config.results

    if (queue) return getWikiImg(queue)
  }

  // if image array is older than 48 hours fetch new image data and store
  getFeaturedPaintingData(function (err, results) {
    if (err) return queue ? queue(err) : null

    results = results.filter(image => !image.href.includes('undefined'))

    cache = knuthShuffle(results)

    if (queue) getWikiImg(queue)
  })
}

function getFeaturedPaintingData (callback) {
  let hasErrorFired = false
  let count = 0
  let response = []

  function onResponse (err, res) {
    if (err && !hasErrorFired) {
      hasErrorFired = true
      return callback(err)
    } else if (err && hasErrorFired) return

    if (!res) return callback('No Wikipedia Content')

    const $ = load(res)
    const $gallerytext = $('.gallerytext')

    response = response.concat(Array.from($('.gallery img').map((i, tag) => {
      const a = $($gallerytext[i]).find('a')

      return {
        title: a[0].attribs.title,
        text: a[1] ? a[1].attribs.title : '',
        href: `https://wikipedia.org${a[0].attribs.href}`,
        img: `https:${tag.attribs.src}`
      }
    })))

    if (++count === 2) return callback(null, response)
  }

  get(`${wikiUrl}/Paintings?${Date.now()}`, onResponse)
  get(`${wikiUrl}/East_Asian_art${Date.now()}`, onResponse)
}

function getDescription (url, callback) {
  return get(`${url}?${Date.now()}`, res => {
    if (!res) return callback('No Wikipedia Content')

    return callback(null, load(res)('#mw-content-text').find('p').html())
  })
}

const pixelRegex = /[0-9]{3,4}px/
const parenRegex = / *\([^)]*\) */g
function getWikiImg (callback) {
  if (!hasInit) {
    queue = callback
    return
  }

  if (!cache.length) {
    return getFeaturedPaintingData(function () {
      getWikiImg(callback)
    })
  }

  const nextImage = cache.pop()

  validateImage(
    nextImage.img.replace(pixelRegex, `${window.innerWidth * window.devicePixelRatio}px`),
    function (err, data) {
      if (err) return callback(err)

      callback(null, {
        title: nextImage.title.replace(parenRegex, ''),
        text: nextImage.text.replace(parenRegex, ''),
        img: data.url,
        naturalHeight: data.naturalHeight,
        naturalWidth: data.naturalWidth
      })
    })
}

module.exports = {
  getWikiConfig,
  giveWikiConfig,
  getWikiImg
}
