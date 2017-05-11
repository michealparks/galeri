module.exports = {getNextArtwork, getConfig}

const apiKey = require('./api-keys').rijks
const {isNullUndefined} = require('../util')
const shuffle = require('../util/shuffle')
const {screenWidth, screenHeight} = require('../util/screen')
const {restoreData, getCollection, getNextPages} = require('./helpers')
const perPage = 30

let callbackRef

const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'rijks_painting:type=painting',
  'rijks_drawing:material=paper&type=drawing&technique=brush'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  let artwork

  if (artworks[category].length > 0) {
    do {
      if (artworks[category].length === 0) break
      artwork = artworks[category].pop()
    } while (artwork.naturalWidth < screenWidth() ||
             artwork.naturalHeight < screenHeight())
  }

  if (artwork === undefined) {
    callbackRef = next
  } else {
    next(undefined, artwork)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category)
  }
}

function getConfig (category) {
  return {
    artworks: artworks[category],
    nextPages: nextPages[category],
    page: page[category]
  }
}

function onGetCollection (err, response, category) {
  if (err !== undefined) {
    if (callbackRef) {
      callbackRef(err)
      callbackRef = undefined
    }

    return __dev__ && console.warn(err)
  }

  for (let art, i = 0, r = response.artObjects || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.webImage) ||
        isNullUndefined(art.links)) continue

    const text = art.longTitle.split(',')

    artworks[category].push({
      source: 'Rijksmuseum',
      href: art.links.web,
      img: art.webImage.url,
      naturalWidth: art.webImage.width,
      naturalHeight: art.webImage.height,
      title: text[0],
      text: text.slice(1).join(', ')
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    nextPages[category] = getNextPages(page[category], response.count, perPage)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'https://www.rijksmuseum.nl/api/en/collection' +
    '?key=' + apiKey +
    '&format=json&ps=' + perPage +
    '&p=' + page[category] +
    '&imgonly=True&' + category
}
