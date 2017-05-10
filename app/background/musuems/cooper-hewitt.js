const ApiTemplate = require('./api-template')
const shuffle = require('../util/shuffle')
const keys = require('./api-keys')

function CooperHewitt () {
  const perPage = 100

  ApiTemplate.call(this, {
    config: 'cooperHewitt',
    endpoint: 'https://api.collection.cooperhewitt.org/rest/',
    endpointParams: `?method=cooperhewitt.search.objects&access_token=${keys.COOPER_HEWITT}&on_display=true&has_images=true&has_no_known_copyright=true&per_page=${perPage}`,
    perPage: perPage,
    nextPage: 1,
    pageParam: '&page=1'
  })
}

CooperHewitt.prototype = Object.create(ApiTemplate.prototype)
CooperHewitt.prototype.constructor = ApiTemplate
CooperHewitt.prototype.handleItemTransform = handleItemTransform
CooperHewitt.prototype.handleCollectionData = handleCollectionData

function handleCollectionData () {
  this.cache = []

  for (let art, i = 0, r = this.req.response.object || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (!art.images[0] || !art.images[0].x) continue

    this.cache.push({
      source: 'Cooper Hewitt, Smithsonian Design Museum',
      href: art.url,
      img: art.images[0],
      naturalWidth: art.images[0].x.width,
      naturalHeight: art.images[0].x.height,
      title: art.title_raw || '',
      text: art.date
    })
  }

  if (!this.nextPages || !this.nextPages.length) {
    this.totalPages = Math.ceil(this.req.response.total / this.perPage)
    this.nextPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.nextPages.push(i)
    }

    shuffle(this.nextPages)
  }

  this.nextPage = this.nextPages.pop()
  this.pageParam = `&page=${this.nextPage}`
}

function handleItemTransform (next) {
  let obj
  do {
    if (!this.cache.length) return next(1)
    obj = this.cache.pop()
  } while (obj.naturalWidth < this.minWidth ||
           obj.naturalHeight < this.minHeight)

  return next(null, obj)
}

module.exports = new CooperHewitt()
