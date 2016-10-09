const { get } = require('https')
const { knuthShuffle } = require('knuth-shuffle')
const perPage = 100
const endpoint = 'https://www.rijksmuseum.nl/api/en/collection'
const dataParameters = `key=xPauC1vP&format=json&ps=${perPage}&imgonly=True`
const artWorkParameters = 'type=painting'
const rijksUrl = `${endpoint}?${dataParameters}&${artWorkParameters}`

let hasInit = false
let cache = []
let queue, nextPage, viewedPages, totalPages

function getRijksConfig () {
  return {
    page: nextPage,
    viewedPages: viewedPages,
    totalPages: totalPages,
    results: cache
  }
}

function giveRijksConfig (config) {
  hasInit = true
  nextPage = config.page || Math.ceil(Math.random() * 19) + 1
  cache = config.results
  viewedPages = config.viewedPages
  totalPages = config.totalPages

  if (queue) getRijksImg(queue)
}

let responseBody
function getRijksMuseumData (page, callback) {
  responseBody = ''
  return get(`${rijksUrl}&p=${page}`, function (res) {
    res.on('data', function (d) { responseBody += d })
    res.on('error', callback)
    res.on('end', () => callback(null, JSON.parse(responseBody)))
  }).on('error', callback)
}

function getNextPageResults (callback) {
  getRijksMuseumData(nextPage, function (err, data) {
    if (err) return callback(err)

    cache = knuthShuffle(data.artObjects)

    if (!viewedPages || !viewedPages.length) {
      totalPages = Math.ceil(data.count / perPage)
      viewedPages = []

      for (let i = 0; i < totalPages; ++i) {
        if (i !== nextPage) viewedPages.push(i)
      }

      knuthShuffle(viewedPages)
    }

    while (viewedPages[nextPage]) {
      nextPage = viewedPages.pop()
    }

    return callback()
  })
}

function getRijksImg (callback) {
  if (!hasInit) {
    queue = callback
    return
  }

  let nextImage
  do {
    if (!cache.length) {
      return getNextPageResults(function (err) {
        if (err) return callback(err)

        return getRijksImg(callback)
      })
    }

    nextImage = cache.pop()
  } while (nextImage.webImage === null ||
           nextImage.webImage.width < window.innerWidth * (window.devicePixelRatio * 0.75) ||
           nextImage.webImage.height < window.innerHeight * (window.devicePixelRatio * 0.75))

  const text = nextImage.longTitle.split(',')

  return callback(null, {
    img: nextImage.webImage.url,
    naturalWidth: nextImage.webImage.width,
    naturalHeight: nextImage.webImage.height,
    title: text[0],
    text: text.slice(1).join(', ')
  })
}

module.exports = {
  getRijksConfig,
  giveRijksConfig,
  getRijksImg
}
