/* global fetch */
const cheerio = require('cheerio')
const wikiUrl = 'https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures'
const parenRegex = / *\([^)]*\)*/g

const getImages = () => Promise.all([
  fetch(`${wikiUrl}/Artwork/Paintings`),
  fetch(`${wikiUrl}/Artwork/East_Asian_art`)
])
  .then(responses => Promise.all(responses.map(res => res.text())))
  .then(responses => {
    return responses.reduce((prev, res) => {
      const $ = cheerio.load(res)
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

const getDescription = url => fetch(url)
  .then(response => response.text())
  .then(response => {
    return cheerio.load(response)('#mw-content-text')
      .find('p').html()
      // remove any unneccessary, cognitive-overloading
      // parenthetical information from wikipedia
      .replace(parenRegex, '')
  })

module.exports = {
  getImages,
  getDescription
}
