module.exports = {getNextArtwork, getConfig}

const apiKey = require('./api-keys').walters
const validate = require('../util/img-size')
const {isNullUndefined} = require('../util')
const shuffle = require('../util/shuffle')
const {restoreData, getCollection} = require('./helpers')

let callbackRef

const artworks = {}
const page = {}

restoreData([
  'walters_painting:classification=painting'
], artworks, undefined, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
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

  for (let art, i = 0, r = response.Items || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.PrimaryImage) ||
        isNullUndefined(art.PrimaryImage.Raw)) continue

    artworks[category].push({
      source: 'The Walters Art Museum',
      href: art.ResourceURL,
      img: `${art.PrimaryImage.Raw}?quality=100&format=jpg`,
      naturalWidth: 0,
      naturalHeight: 0,
      title: art.Title,
      text: art.Creator
    })
  }

  shuffle(artworks[category])

  if (response.NextPage) {
    page[category] += 1
  } else {
    page[category] = 0
  }

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'http://api.thewalters.org/v1/objects' +
    '?apikey=' + apiKey +
    '&page=' + page[category] +
    '&' + category
}
