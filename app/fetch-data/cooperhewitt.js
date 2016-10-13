const ApiTemplate = require('./api-template')
const shuffle = require('../util/shuffle')

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

CooperHewitt.prototype
.onCollectionResponse = function () {
  this.cache = this.req.response.objects

  shuffle(this.cache)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.total / this.perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    shuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  return this.next()
}

CooperHewitt.prototype
.handleItemTransform = function (next) {
  let obj
  do {
    if (!this.cache.length) {
      return next({
        errType: 'warn',
        file: 'fetch-data/cooperhewitt.js',
        fn: 'handleItemTransform()',
        msg: 'No Images from Cooper Hewitt'
      })
    }

    obj = this.cache.pop()
  } while (!obj.images[0] ||
           !obj.images[0].x ||
            obj.images[0].x.width < window.innerWidth * (window.devicePixelRatio * 0.75) ||
            obj.images[0].x.height < window.innerHeight * (window.devicePixelRatio * 0.75))

  return next(null, {
    source: 'Cooper Hewitt, Smithsonian Design Museum',
    href: obj.url,
    img: obj.images[0].x.url,
    naturalWidth: obj.images[0].x.width,
    naturalHeight: obj.images[0].x.height,
    title: obj.title_raw,
    text: obj.date
  })
}

module.exports = new CooperHewitt()
