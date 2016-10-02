const { get } = require('https')
const { parse } = require('url')
const { load } = require('cheerio')
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const wikiUrl = 'https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures/Artwork'

let hasInit = false
let cache = []
let queue
let writeToConfig

const headers = {
  'cache-control': 'no-cache, no-store',
  'pragma-directive': 'no-cache',
  'cache-directive': 'no-cache',
  'pragma': 'no-cache',
  'expires': '0'
}

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

    writeToConfig({ timestamp: Date.now(), results })

    cache = knuthShuffle(results)

    if (queue) getNextWikipediaImage(cache.pop(), queue)
  })
}

const getCategory = (url, callback, { hostname, path } = parse(url)) =>
  get({ headers, hostname, path: `${path}?${Date.now()}` }, res => {
    if (res.statusCode === 301) {
      return getCategory(res.headers.location, callback)
    }
    let body = ''

    res.on('data', d => { body += d })
    res.on('end', () => callback(null, body))
  }).on('error', callback)

const getFeaturedPaintingData = (callback) => {
  let hasErrorFired = false
  let count = 0
  let response = []

  const onResponse = (err, res) => {
    if (err & !hasErrorFired) {
      hasErrorFired = true
      return callback(err)
    }

    const $ = load(res)
    const $gallerytext = $('.gallerytext')

    response = response.concat(Array.from($('img').map((i, tag) => {
      const rawUrl = tag.attribs.src.split('/')
      const size = rawUrl.pop().replace(/^[0-9]{3,4}px/, '2000px')
      const { title, href } = $($gallerytext[i]).find('a')[0].attribs

      return {
        title,
        href: `https://wikipedia.org${href}`,
        img: `https:${rawUrl.join('/')}/${size}`
      }
    })))

    if (++count === 2) return callback(null, response)
  }

  getCategory(`${wikiUrl}/Paintings`, onResponse)
  getCategory(`${wikiUrl}/East_Asian_art`, onResponse)
}

const getDescription = (url, callback, { hostname, path } = parse(url)) =>
  get({ headers, hostname, path: `${path}?${Date.now()}` }, res => {
    if (res.statusCode === 301) {
      return getDescription(res.headers.location, callback)
    }

    let body = ''

    res.on('data', d => { body += d })
    res.on('end', () =>
      callback(null, load(body)('#mw-content-text').find('p').html())
    )
  }).on('error', callback)

const getNextWikipediaImage = callback => {
  if (!hasInit) { queue = callback; return }
  if (!cache.length) getNextPage(() => getNextRijksImage(callback))

  const { img, href, title } = cache.pop()

  let count = 0
  let content = ''

  getDescription(href, (err, description) => {
    if (err) return callback(err)
    content = description
    if (++count === 2) callback(null, { content, img, title })
  })

  validateImage(img, (err, url) => {
    if (err) return callback(err)
    if (++count === 2) callback(null, { content, img, title })
  })
}

module.exports = {
  provideWikipediaConfig,
  getNextWikipediaImage
}
