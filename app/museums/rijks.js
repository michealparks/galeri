const fetch = require('../util/fetch')
const apiKey = require('./keys').rijks

const url = (type, page, perPage) => (
  'https://www.rijksmuseum.nl/api/en/collection' +
  '?key=' + apiKey +
  '&p=' + page +
  '&format=json&ps=' + perPage +
  '&imgonly=True&' + type
)

const getArtwork = (type, page, perPage, next) => fetch(url(type, page, perPage), (err, {artObjects = [], count}) => {
  if (err) return next(err)

  const artworks = []

  for (let i = artObjects.length - 1; i > -1; i -= 1) {
    const {webImage, links, longTitle} = artObjects[i]

    if (!webImage || !links) continue

    const text = longTitle.split(',')

    artworks.push({
      source: 'Rijksmuseum',
      href: links.web,
      title: text[0],
      text: text.slice(1).join(', '),
      isFavorited: false,
      imgsrc: webImage.url,
      localsrc: '',
      width: webImage.width,
      height: webImage.height
    })
  }

  next(undefined, artworks, count)
})

module.exports = getArtwork
