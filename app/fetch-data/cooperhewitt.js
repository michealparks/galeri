const ApiTemplate = require('./api-template')
const shuffle = require('../util/shuffle')

function CooperHewitt () {
  const perPage = 100

  ApiTemplate.call(this, {
    endpoint: 'https://api.collection.cooperhewitt.org/rest/',
    endpointParams: `?method=cooperhewitt.search.objects&access_token=065eb1fb4238bb6af1fbf030b2ccade8&on_display=true&has_images=true&has_no_known_copyright=true&per_page=${perPage}`,
    perPage,
    nextPage: 1,
    pageParam: '&page=1'
  })

  this.onCollectionResponse = onCollectionResponse.bind(this)
}

CooperHewitt.prototype = Object.create(ApiTemplate.prototype)
CooperHewitt.prototype.constructor = ApiTemplate
CooperHewitt.prototype.handleItemTransform = handleItemTransform

function onCollectionResponse () {
  if (this.req.status !== 200) return this.onError(this.req.status)

  this.cache = this.req.response.objects

  if (!this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.total / this.perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    shuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()
  this.pageParam = `&page=${this.nextPage}`

  if (!this.cache.length) return this.onError('CooperHewitt: no images.')

  shuffle(this.cache)

  return this.next()
}

function handleItemTransform (next) {
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
            obj.images[0].x.width < this.minWidth ||
            obj.images[0].x.height < this.minHeight)

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
