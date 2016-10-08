const { knuthShuffle } = require('knuth-shuffle')
const perPage = 100
const endpoint = 'https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.search.objects&access_token=065eb1fb4238bb6af1fbf030b2ccade8'
const dataParams = `&on_display=true&has_images=true&has_no_known_copyright=true`
const departments = [
  '35347493', // drawing
  '35347501', // textiles
  '35347503' // wall coverings
]

let hasInit = false
let cache = []
let queue, nextPage, viewedPages, totalPages

function getCooperHewittConfig () {
  return {
    page: nextPage,
    viewedPages: viewedPages,
    totalPages: totalPages,
    results: cache
  }
}

function giveCooperHewittConfig (config) {
  hasInit = true
  nextPage = config.page || 1
  cache = config.results
  viewedPages = config.viewedPages
  totalPages = config.totalPages

  if (queue) getCooperHewittImg(queue)
}

let req, resCount, res
function onCooperHewittResponse (i, callback) {
  res = res.concat(req[i].response.objects)

  console.log(req[i].response, res)

  if (++resCount === 3) {
    onAllCooperHewittResponses(null, res, callback)
  }
}

function getCooperHewittMuseumData (page, callback) {
  req = []
  res = []
  resCount = 0

  for (let i = 0, l = departments.length; i < l; i++) {
    req[i] = new window.XMLHttpRequest()
    req[i].open('GET', `${endpoint}&department_id=${departments[i]}${dataParams}&page=${page}&per_page=${perPage}`, true)
    req[i].responseType = 'json'
    req[i].addEventListener('load', function () {
      onCooperHewittResponse(i, callback)
    })
    req[i].addEventListener('error', callback)
    req[i].send()
  }
}

function onAllCooperHewittResponses (err, objects, callback) {
  if (err) return callback(err)

  cache = knuthShuffle(objects)

  if (!viewedPages || !viewedPages.length) {
    totalPages = Math.ceil(objects.length / perPage)
    console.log('here', totalPages)

    viewedPages = []

    for (let i = 0; i < totalPages; ++i) {
      if (i !== nextPage) viewedPages.push(i)
    }

    knuthShuffle(viewedPages)
  }

  nextPage = viewedPages.pop()

  return callback()
}

function getNextPageResults (callback) {
  getCooperHewittMuseumData(nextPage, callback)
}

function getCooperHewittImg (callback) {
  if (!hasInit) {
    queue = callback
    return
  }

  let nextImage
  do {
    if (!cache.length) {
      return getNextPageResults(function (err) {
        if (err) return callback(err)

        return getCooperHewittImg(callback)
      })
    }

    nextImage = cache.pop()
    if (nextImage.images && nextImage.images[0].x) {
      console.log(nextImage.images[0].x.width, nextImage.images[0].x.height)
    }
  } while (!nextImage.images[0] ||
           !nextImage.images[0].x ||
            nextImage.images[0].x.width < window.innerWidth * (window.devicePixelRatio * 0.75) ||
            nextImage.images[0].x.height < window.innerHeight * (window.devicePixelRatio * 0.75))

  return callback(null, {
    img: nextImage.images[0].x.url,
    naturalWidth: nextImage.images[0].x.width,
    naturalHeight: nextImage.images[0].x.height,
    title: nextImage.title_raw,
    text: nextImage.date
  })
}

module.exports = {
  getCooperHewittConfig,
  giveCooperHewittConfig,
  getCooperHewittImg
}
