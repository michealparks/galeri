/* global XMLHttpRequest */
const { knuthShuffle } = require('knuth-shuffle')
const perPage = 100
const endpoint = 'https://api.collection.cooperhewitt.org/rest/'
const apiKey = '065eb1fb4238bb6af1fbf030b2ccade8'
const endpointParams = `?method=cooperhewitt.search.objects&access_token=${apiKey}&on_display=true&has_images=true&has_no_known_copyright=true&per_page=${perPage}`

const apiInterface = require('./api-interface')({
  endpoint,
  endpointParams,
  nextPage: 1,
  pageParam: '&page=1'
})

apiInterface.onCollectionResponse = function onCollectionResponse (response, next) {
  this.cache = knuthShuffle(response.objects)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(response.total / perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    knuthShuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  return next()
}.bind(apiInterface)

apiInterface.handleItemTransform = function handleItemTransform (next) {
  let nextImage
  do {
    if (!this.cache.length) return next('No Images')

    nextImage = this.cache.pop()
  } while (!nextImage.images[0] ||
           !nextImage.images[0].x ||
            nextImage.images[0].x.width < window.innerWidth * (window.devicePixelRatio * 0.75) ||
            nextImage.images[0].x.height < window.innerHeight * (window.devicePixelRatio * 0.75))

  return next(null, {
    img: nextImage.images[0].x.url,
    naturalWidth: nextImage.images[0].x.width,
    naturalHeight: nextImage.images[0].x.height,
    title: nextImage.title_raw,
    text: nextImage.date
  })
}.bind(apiInterface)

module.exports = apiInterface

// function getCooperHewittConfig () {
//   return {
//     page: nextPage,
//     viewedPages: viewedPages,
//     totalPages: totalPages,
//     results: cache
//   }
// }

// function giveCooperHewittConfig (config) {
//   hasInit = true
//   nextPage = config.page || 1
//   cache = config.results
//   viewedPages = config.viewedPages
//   totalPages = config.totalPages

//   if (queue) getCooperHewittImg(queue)
// }

// let req
// function onCooperHewittResponse (callback) {
//   cache = knuthShuffle(req.response.objects)

//   if (!viewedPages || !viewedPages.length) {
//     totalPages = Math.ceil(req.response.total / perPage)

//     viewedPages = []

//     for (let i = 0; i < totalPages; ++i) {
//       if (i !== nextPage) viewedPages.push(i)
//     }

//     knuthShuffle(viewedPages)
//   }

//   nextPage = viewedPages.pop()

//   return callback()
// }

// function getCooperHewittMuseumData (page, callback) {
//   req = new XMLHttpRequest()
//   req.open('GET', `${endpoint}${endpointParams}&department_id=35347493&page=${page}&per_page=${perPage}`, true)
//   req.responseType = 'json'
//   req.addEventListener('load', function () {
//     onCooperHewittResponse(callback)
//   })
//   req.addEventListener('error', callback)
//   req.send()
// }

// function getNextPageResults (callback) {
//   getCooperHewittMuseumData(nextPage, callback)
// }

// function getCooperHewittImg (callback) {
//   if (!hasInit) {
//     queue = callback
//     return
//   }

//   let nextImage
//   do {
//     if (!cache.length) {
//       return getNextPageResults(function (err) {
//         if (err) return callback(err)

//         return getCooperHewittImg(callback)
//       })
//     }

//     nextImage = cache.pop()
//   } while (!nextImage.images[0] ||
//            !nextImage.images[0].x ||
//             nextImage.images[0].x.width < window.innerWidth * (window.devicePixelRatio * 0.75) ||
//             nextImage.images[0].x.height < window.innerHeight * (window.devicePixelRatio * 0.75))

//   return callback(null, {
//     img: nextImage.images[0].x.url,
//     naturalWidth: nextImage.images[0].x.width,
//     naturalHeight: nextImage.images[0].x.height,
//     title: nextImage.title_raw,
//     text: nextImage.date
//   })
// }

// module.exports = {
//   getCooperHewittConfig,
//   giveCooperHewittConfig,
//   getCooperHewittImg
// }
