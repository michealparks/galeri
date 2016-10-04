const get = require('../util/get')
const { load } = require('cheerio')
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const wikiUrl = 'https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures/Artwork'

let hasInit = false
let cache = []
let queue
let writeToConfig

window.addEventListener('beforeunload', e => {
  writeToConfig({
    timestamp: Date.now(),
    cache
  })
})

const provideWikipediaConfig = ({ timestamp, results }, write) => {
  hasInit = true
  writeToConfig = write

  if (timestamp && Date.now() - timestamp < 1000 * 60 * 60 * 48) {
    cache = results

    if (queue) return getNextWikipediaImage(queue)
  }

  // if image array is older than 48 hours fetch new image data and store
  getFeaturedPaintingData((err, results) => {
    if (err) return queue ? queue(err) : null

    results = results.filter(image => !image.href.includes('undefined'))

    cache = knuthShuffle(results)

    if (queue) getNextWikipediaImage(cache.pop(), queue)
  })
}

const getFeaturedPaintingData = (callback) => {
  let hasErrorFired = false
  let count = 0
  let response = []

  const onResponse = (err, res) => {
    if (err && !hasErrorFired) {
      hasErrorFired = true
      return callback(err)
    } else if (err && hasErrorFired) return

    if (!res) return callback('No Wikipedia Content')

    const $ = load(res)
    const $gallerytext = $('.gallerytext')

    response = response.concat(Array.from($('.gallery img').map((i, tag) => {
      const rawUrl = tag.attribs.src.split('/')
      const size = rawUrl.pop()
      const a = $($gallerytext[i]).find('a')
      const { title, href } = a[0].attribs

      return {
        title,
        text: a[1] ? a[1].attribs.title : '',
        content: `
          <h3>${a[0].attribs.title.replace(/ *\([^)]*\) */g, '')}</h3>
          <p>${a[1] ? a[1].attribs.title : ''}</p>
        `,
        href: `https://wikipedia.org${href}`,
        img: `https:${rawUrl.join('/')}/${size}`
      }
    })))

    if (++count === 2) return callback(null, response)
  }

  get(`${wikiUrl}/Paintings?${Date.now()}`, onResponse)
  get(`${wikiUrl}/East_Asian_art${Date.now()}`, onResponse)
}

const getDescription = (url, callback) => get(`${url}?${Date.now()}`, res => {
  if (!res) return callback('No Wikipedia Content')

  return callback(null, load(res)('#mw-content-text').find('p').html())
})

const getNextWikipediaImage = callback => {
  if (!hasInit) { queue = callback; return }
  if (!cache.length) {
    return getFeaturedPaintingData(() => getNextWikipediaImage(callback))
  }

  const { img, href, title, content } = cache.pop()

  validateImage(
    img.replace(/[0-9]{3,4}px/, `${window.innerWidth}px`),
    (err, { naturalWidth, naturalHeight, url }) => {
      if (err) return callback(err)
      callback(null, {
        content,
        img: url,
        title,
        naturalHeight,
        naturalWidth
      })
    })
}

module.exports = {
  provideWikipediaConfig,
  getNextWikipediaImage
}
