const ApiTemplate = require('./api-template')
const validateImg = require('../util/validate-img')
const shuffle = require('../util/shuffle')

function WaltersMuseum () {
  const perPage = 100

  ApiTemplate.call(this, {
    perPage,
    endpoint: 'http://api.thewalters.org/v1/objects',
    endpointParams: '?apikey=ar9kcanGaRe3Wk4b5wyNdcqZJgYS7VQoQihXukTZPGwtHrxG78hfCZJx1aQv1K95&classification=painting',
    nextPage: 1,
    pageParam: '&page=1'
  })

  this.onCollectionResponse = onCollectionResponse.bind(this)
}

WaltersMuseum.prototype = Object.create(ApiTemplate.prototype)
WaltersMuseum.prototype.constructor = ApiTemplate
WaltersMuseum.prototype.handleItemTransform = handleItemTransform

function onCollectionResponse () {
  if (this.req.status !== 200) return this.onError(this.req.status)

  this.cache = this.req.response.Items

  if (this.req.response.NextPage) this.nextPage += 1
  else this.nextPage = 0

  this.pageParam = `&page=${this.nextPage}`

  if (!this.cache.length) return this.onError('WaltersMuseum: no images.')

  shuffle(this.cache)

  return this.next()
}

function handleItemTransform (next) {
  let obj

  do { obj = this.cache.pop() }
  while (!obj.PrimaryImage || !obj.PrimaryImage.Raw)

  return validateImg({
    url: obj.PrimaryImage.Raw,
    minHeight: this.minHeight,
    minWidth: this.minWidth
  }, (err, data) => err ? next(err) : next(null, {
    source: 'The Walters Art Museum',
    href: obj.ResourceURL,
    title: obj.Title,
    text: obj.Creator,
    img: `${data.url}?quality=100&format=jpg`,
    naturalHeight: data.naturalHeight,
    naturalWidth: data.naturalWidth
  }))
}

module.exports = new WaltersMuseum()
