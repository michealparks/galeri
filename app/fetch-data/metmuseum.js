const ApiTemplate = require('./api-template')
const validateImg = require('../util/validate-img')
const shuffle = require('../util/shuffle')

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

  this.onCollectionResponse = onCollectionResponse.bind(this)
}

MetMuseum.prototype = Object.create(ApiTemplate.prototype)
MetMuseum.prototype.constructor = ApiTemplate
MetMuseum.prototype.handleItemTransform = handleItemTransform

function onCollectionResponse () {
  if (this.req.status !== 200) return this.onError(this.req.status)

  this.cache = this.req.response.results

  shuffle(this.cache)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.totalResults / this.perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    shuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  this.pageParam = `&page=${this.nextPage}`
  return this.next()
}

function handleItemTransform (next) {
  const obj = this.cache.pop()

  return validateImg({
    url: obj.image.replace('web-thumb', 'original'),
    minHeight: this.minHeight,
    minWidth: this.minWidth
  }, (err, data) => err ? next(err) : next(null, {
    source: 'The Metropolitan Museum of Art',
    href: `https://metmuseum.org${obj.url}`,
    title: obj.title,
    text: obj.subTitle,
    img: data.url,
    naturalHeight: data.naturalHeight,
    naturalWidth: data.naturalWidth
  }))
}

module.exports = new MetMuseum()
