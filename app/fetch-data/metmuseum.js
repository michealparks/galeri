const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const ApiTemplate = require('./api-template')

function MetMuseum () {
  const perPage = 20
  const randSeed = Math.ceil(Math.random() * 20)

  ApiTemplate.call(this, {
    perPage,
    endpoint: 'http://metmuseum.org/api/collection/search',
    endpointParams: `?q=oil%20on%20canvas&perPage=${perPage}`,
    nextPage: randSeed,
    pageParam: `&page=${randSeed}`
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
}

MetMuseum.prototype = Object.create(ApiTemplate.prototype)
MetMuseum.prototype.constructor = ApiTemplate

MetMuseum.prototype.onCollectionResponse = function () {
  this.cache = knuthShuffle(this.req.response.results)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.totalResults / this.perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    knuthShuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  this.pageParam = `&page=${this.nextPage}`
  return this.next()
}

MetMuseum.prototype.handleItemTransform = function (next) {
  const obj = this.cache.pop()

  return validateImage({
    url: obj.image.replace('web-thumb', 'original'),
    minHeight: window.innerHeight * window.devicePixelRatio * 0.73,
    minWidth: window.innerWidth * window.devicePixelRatio * 0.73
  }, function (err, data) {
    if (err) return next(err)

    next(null, {
      title: obj.title,
      text: obj.subTitle,
      img: data.url,
      naturalHeight: data.naturalHeight,
      naturalWidth: data.naturalWidth
    })
  })
}

module.exports = new MetMuseum()
