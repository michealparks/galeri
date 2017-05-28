module.exports = {getNextArtwork, getConfig}

const validate = require('../util/img-size')
const shuffle = require('../util/shuffle')
const parseHTML = require('../util/html-parser')
const {restoreData, getCollection, getNextPages} = require('./helpers')
const perPage = 20

let callbackRef

const artworks = {}
const nextPages = {}
const page = {}

restoreData(['saam_painting:Painting'], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    validate(artwork, next)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category, 'text')
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
    if (callbackRef !== undefined) {
      callbackRef(err)
      callbackRef = undefined
    }
    return __dev__ && console.warn(err)
  }

  const html = parseHTML(response)
  const list = (html.querySelector('#contentSearchListArtwork > ul') || {}).children

  for (let art, title, i = 0, r = list || [], l = r.length; i < l; ++i) {
    art = r[i]
    title = art.querySelector('.artworkDetails h3 a')

    artworks[category].push({
      source: 'The Walters Art Museum',
      img: `${art.querySelector('img').getAttribute('src').split('&')[0]}?quality=100&format=jpg`,
      title: title.textContent,
      text: art.querySelector('.artworkDetails span[title="artist"]').textContent,
      href: `https://americanart.si.edu${title.getAttribute('href')}`,
      naturalWidth: 0,
      naturalHeight: 0
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const count = Number(html
      .querySelector('#contentSearchListArtworkTitle p')
      .textContent.trim().split(' ').pop())
    const totalPages = Math.ceil(count / perPage)
    nextPages[category] = getNextPages(page[category], totalPages, 1)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'http://americanart.si.edu/collections/search/artwork/results/index.cfm' +
    '?rows=' + perPage +
    '&fq=online_media_type:%22Images%22&q=' + category +
    '&page=' + page[category] +
    '&start=' + (perPage * page[category]) + '&x=57&y=8'
}
