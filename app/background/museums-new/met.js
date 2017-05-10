module.exports = {getNextArtwork, getConfig}

const {isNullUndefined} = require('../util')
const validate = require('../util/img-size')
const shuffle = require('../util/shuffle')
const {restoreData, getCollection, getNextPages} = require('./helpers')
const parseHTML = require('../util/html-parser')
const perPage = 20

let callbackRef

const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'met_acrylic:acrylic on canvas',
  'met_oil:oil on canvas',
  'met_ink:ink and color on paper'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    validate(artwork, next)
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

  for (let art, i = 0, r = response.results || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.image) ||
        art.image.indexOf('.ashx') > -1 ||
        art.image.indexOf('NoImageAvailableIcon.png') > -1) continue

    if (art.image.indexOf('http') === -1) {
      art.image = 'http://metmuseum.org/' + art.image
    }

    artworks[category].push({
      source: 'The Metropolitan Museum of Art',
      href: `https://metmuseum.org${art.url}`,
      title: parseHTML(art.title).textContent,
      text: parseHTML(art.subTitle).textContent,
      img: art.image.replace('web-thumb', 'original'),
      naturalWidth: 0,
      naturalHeight: 0
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
    callbackRef = undefined
  }
}

function makeReqUrl (category) {
  return 'https://metmuseum.org/api/collection/search' +
    '?q=' + encodeURIComponent(category) +
    '&perPage=' + perPage +
    '&page=' + page[category]
}
