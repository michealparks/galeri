const { knuthShuffle } = require('knuth-shuffle')
const ApiTemplate = require('./api-template')

function CooperHewitt () {
  const perPage = 100
  const apiKey = '065eb1fb4238bb6af1fbf030b2ccade8'
  const endpointParams = `?method=cooperhewitt.search.objects&access_token=${apiKey}&on_display=true&has_images=true&has_no_known_copyright=true&per_page=${perPage}`

  ApiTemplate.call(this, {
    endpointParams,
    perPage,
    endpoint: 'https://api.collection.cooperhewitt.org/rest/',
    nextPage: 1,
    pageParam: '&page=1'
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
}

CooperHewitt.prototype = Object.create(ApiTemplate.prototype)
CooperHewitt.prototype.constructor = ApiTemplate

CooperHewitt.prototype.onCollectionResponse = function () {
  this.cache = knuthShuffle(this.req.response.objects)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.total / this.perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    knuthShuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  return this.next()
}

CooperHewitt.prototype.handleItemTransform = function (next) {
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
}

module.exports = new CooperHewitt()
