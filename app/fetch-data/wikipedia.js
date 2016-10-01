/* global fetch */
const { get } = require('https')
const { parse } = require('url')
const { load } = require('cheerio')
const wikiUrl = 'https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures'

const toText = res => res.text()

const getImages = () => Promise.all([
  fetch(`${wikiUrl}/Artwork/Paintings`).then(toText),
  fetch(`${wikiUrl}/Artwork/East_Asian_art`).then(toText)
])
  .then(responses => {
    return responses.reduce((prev, res) => {
      const $ = load(res)
      const $gallerytext = $('.gallerytext')

      return prev.concat(Array.from($('img').map((i, tag) => {
        const rawUrl = tag.attribs.src.split('/')
        const size = rawUrl.pop().replace(/^[0-9]{3,4}\px/, '2000px')
        const { title, href } = $($gallerytext[i]).find('a')[0].attribs

        return {
          title,
          href: `https://wikipedia.org${href}`,
          img: `https:${rawUrl.join('/')}/${size}`
        }
      })))
    }, [])
  })

const getDescription = (url, callback, opts = parse(url)) => get({
  hostname: opts.hostname,
  path: `${opts.path}?${Date.now()}`,
  headers: {
    'cache-control': 'no-cache, no-store',
    'pragma-directive': 'no-cache',
    'cache-directive': 'no-cache',
    'pragma': 'no-cache',
    'expires': '0'
  }
}, res => {
  if (res.statusCode === 301) {
    return getDescription(res.headers.location, callback)
  }

  let body = ''

  res.on('data', d => { body += d })
  res.on('end', () =>
    callback(null, load(body)('#mw-content-text').find('p').html())
  )
}).on('error', callback)

module.exports = {
  getImages,
  getDescription
}
