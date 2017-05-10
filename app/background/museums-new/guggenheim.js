module.exports = {getNextArtwork, getConfig}

const shuffle = require('../util/shuffle')
const {screenWidth, screenHeight} = require('../util/screen')
const {restoreData, getCollection, getNextPages} = require('./helpers')
const perPage = 27
const goodMediums = /goache|ink|monoprint|watercolor|graphite|metallic ink/
const badMediums = /ink on paper|graphite and collage on paper/

let callbackRef

const nextPages = {}
const page = {}
const artworks = {}

restoreData([
  'guggenheim_painting:painting',
  'guggenheim_paper:work-on-paper'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  callbackRef = undefined
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
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, getCollectionUrl(category), category)
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

  for (let art, i = 0, r = response || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (!goodMediums.test(art.medium.toLowerCase()) ||
         badMediums.test(art.medium.toLowerCase())) continue

    artworks[category].push({
      source: 'Solomon R. Guggenheim Museum',
      href: art.link,
      img: art.featured_image.src,
      naturalWidth: art.featured_image.width,
      naturalHeight: art.featured_image.height,
      title: art.sort_title,
      text: art.artist[0].name
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const totalPages = 22 /* hardcoded :( */
    nextPages[category] = getNextPages(page[category], totalPages, 1)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
    callbackRef = undefined
  }
}

function getCollectionUrl (category) {
  return 'https://www.guggenheim.org/wp-json/wp/v2/artwork' +
    '?filter[artwork_type]=' + category +
    '&per_page=' + perPage +
    '&page=' + page[category]
}
