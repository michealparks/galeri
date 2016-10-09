/* global XMLHttpRequest */
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const perPage = 100
const endpoint = 'http://api.thewalters.org/v1/objects?apikey=ar9kcanGaRe3Wk4b5wyNdcqZJgYS7VQoQihXukTZPGwtHrxG78hfCZJx1aQv1K95'
const classification = 'Painting%20&%20Drawing'

let hasInit = false
let cache = []
let queue, nextPage

function getWaltersMuseumConfig () {
  return {
    page: nextPage,
    results: cache
  }
}

function giveWaltersMuseumConfig (config) {
  hasInit = true
  nextPage = config.page || 1
  cache = config.results

  if (queue) getWaltersMuseumImg(queue)
}

let req

function getWaltersMuseumMuseumData (callback) {
  req = new XMLHttpRequest()
  req.open('GET', `${endpoint}&Classification=${classification}&page=${nextPage}&pageSize=${perPage}`, true)
  req.responseType = 'json'
  req.addEventListener('load', function () {
    onWaltersMuseumResponse(null, callback)
  })
  req.addEventListener('error', callback)
  req.send()
}

function onWaltersMuseumResponse (err, callback) {
  if (err) return callback(err)

  if (req.response.NextPage) ++nextPage
  else nextPage = 0

  cache = knuthShuffle(req.response.Items)

  return callback()
}

function getWaltersMuseumImg (callback) {
  if (!hasInit) {
    queue = callback
    return
  }

  if (!cache.length) {
    return getWaltersMuseumMuseumData(function (err) {
      if (err) return callback(err)

      return getWaltersMuseumImg(callback)
    })
  }

  let nextImage

  do {
    nextImage = cache.pop()
  } while (!nextImage.PrimaryImage || !nextImage.PrimaryImage.Raw)

  validateImage({
    url: nextImage.PrimaryImage.Raw,
    minHeight: window.innerHeight * window.devicePixelRatio * 0.7,
    minWidth: window.innerWidth * window.devicePixelRatio * 0.7
  }, function (err, data) {
    if (err) return callback(err)

    callback(null, {
      title: nextImage.Title,
      text: nextImage.Creator,
      img: `${data.url}?quality=100&format=jpg`,
      naturalHeight: data.naturalHeight,
      naturalWidth: data.naturalWidth
    })
  })
}

module.exports = {
  getWaltersMuseumConfig,
  giveWaltersMuseumConfig,
  getWaltersMuseumImg
}
