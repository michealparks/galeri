const cheerio = require('cheerio')
const fetch = require('../util/fetch')
const pixelReg = /[0-9]{3,4}px/
const parenReg = / *\([^)]*\) */g

const url = (type) => 'https://en.wikipedia.org/w/api.php' +
  '?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/' +
  type + '&format=json&origin=*'

const getArtwork = (type, page, perPage, next) => fetch(url(type), (err, {parse}) => {
  if (err) return next(err)

  const artworks = []
  const $ = cheerio.load(parse.text['*'])
  const items = $('.gallerybox')

  for (let i = items.length - 1; i > -1; i -= 1) {
    const img = $($(items[i]).find('img'))
    const links = $(items[i]).find('.gallerytext a')
    const a0 = $(links[0])
    const a1 = $(links[1])

    artworks.push({
      source: 'Wikipedia',
      href: `https://wikipedia.org${a0.attr('href')}`,
      title: (a0.attr('title') || '').replace(parenReg, ''),
      text: (a1.attr('title') || '').replace(parenReg, ''),
      isFavorited: false,
      imgsrc: `https:${img.attr('src').replace(pixelReg, '3000px')}`,
      localsrc: '',
      width: 3000,
      height: 3000
    })
  }

  next(undefined, artworks)
})

module.exports = getArtwork
