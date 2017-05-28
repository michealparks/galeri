module.exports = {getNextArtwork, getConfig}

const validate = require('../util/img-size')
const shuffle = require('../util/shuffle')
const parseHTML = require('../util/html-parser')
const {screenWidth} = require('../util/screen')
const {restoreData, getCollection} = require('./helpers')

const pixelRegex = /[0-9]{3,4}px/
const parenRegex = / *\([^)]*\) */g
const artworks = {}

let callbackRef

restoreData(['wikipedia:Paintings'], artworks)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    const size = `${Math.floor(screenWidth() + 500)}px`
    artwork.img = artwork.img.replace(pixelRegex, size)
    validate(artwork, next)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category)
  }
}

function getConfig (category) {
  return {
    artworks: artworks[category]
  }
}

function onGetCollection (err, response, category) {
  if (err !== undefined) {
    if (callbackRef !== undefined) {
      getNextArtwork(category, callbackRef)
      callbackRef = undefined
    }

    return __dev__ && console.warn(err)
  }

  const html = parseHTML(response.parse.text['*'])
  const gallerytext = html.getElementsByClassName('gallerytext')

  for (let i = 0, list = html.querySelectorAll('.gallery img'), l = list.length; i < l; ++i) {
    const a = gallerytext[i].querySelectorAll('a')

    artworks[category].push({
      source: 'Wikipedia',
      title: a[0].getAttribute('title').replace(parenRegex, ''),
      text: a[1] ? a[1].getAttribute('title').replace(parenRegex, '') : '',
      href: `https://wikipedia.org${a[0].getAttribute('href')}`,
      img: `https:${list[i].getAttribute('src')}`
    })
  }

  shuffle(artworks[category])

  if (callbackRef) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'https://en.wikipedia.org/w/api.php' +
    '?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/' +
    category + '&format=json&origin=*'
}
