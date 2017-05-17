module.exports = {getNextArtwork, getConfig}

const apiKey = require('./api-keys').harvard
const validate = require('../util/img-size')
const {isNullUndefined} = require('../util')
const {screenWidth, screenHeight} = require('../util/screen')
const shuffle = require('../util/shuffle')
const {restoreData, getCollection, getNextPages} = require('./helpers')
const hueRegex = /Grey|Black|White/
const perPage = 30

let callbackRef

const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'harvard_painting:Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    artwork.img = `${artwork.img}?width=${screenWidth()}&height=${screenHeight()}`
    validate(artwork, next)
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

  for (let art, i = 0, r = response.records || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.primaryimageurl) ||
        isNullUndefined(art.colors) ||
        art.colors.every(d => hueRegex.test(d.hue))) continue

    artworks[category].push({
      source: 'Harvard Art Museums',
      href: art.url,
      img: art.primaryimageurl,
      naturalWidth: 0,
      naturalHeight: 0,
      title: art.title,
      text: art.people && art.people[0] ? art.people[0].name : ''
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const totalPages = Math.ceil(response.totalResults / perPage)
    nextPages[category] = getNextPages(page[category], totalPages, 0)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'http://api.harvardartmuseums.org/object' +
    '?apikey=' + apiKey +
    '&size=' + perPage +
    '&page=' + page[category] +
    '&medium=' + category
}
