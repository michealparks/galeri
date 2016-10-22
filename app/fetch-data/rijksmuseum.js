const ApiTemplate = require('./api-template')
const shuffle = require('../util/shuffle')

function RijksMuseum (type) {
  const perPage = 100
  const randSeed = Math.ceil(Math.random() * 20)

  ApiTemplate.call(this, {
    perPage,
    endpoint: 'https://www.rijksmuseum.nl/api/en/collection',
    endpointParams: `?key=xPauC1vP&format=json&ps=${perPage}&imgonly=True&type=${type}`,
    nextPage: randSeed,
    pageParam: `&p=${randSeed}`
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
}

RijksMuseum.prototype = Object.create(ApiTemplate.prototype)
RijksMuseum.prototype.constructor = ApiTemplate
RijksMuseum.prototype.onCollectionResponse = onCollectionResponse
RijksMuseum.prototype.handleItemTransform = handleItemTransform

function onCollectionResponse () {
  if (this.req.status !== 200) return this.onError(this.req.status)

  this.cache = this.req.response.artObjects

  shuffle(this.cache)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(this.req.response.count / this.perPage)
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
  let obj

  do {
    if (!this.cache.length) return next('No Images')
    obj = this.cache.pop()
  } while (obj.webImage === null ||
           obj.webImage.width < window.innerWidth * (window.devicePixelRatio * 0.77) ||
           obj.webImage.height < window.innerHeight * (window.devicePixelRatio * 0.77))

  const text = obj.longTitle.split(',')

  return next(null, {
    source: 'Rijksmuseum',
    href: (obj.links || {}).web,
    img: obj.webImage.url,
    naturalWidth: obj.webImage.width,
    naturalHeight: obj.webImage.height,
    title: text[0],
    text: text.slice(1).join(', ')
  })
}

module.exports = new RijksMuseum('painting')
