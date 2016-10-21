const ApiTemplate = require('./api-template')
const validateImg = require('../util/validate-img')
const shuffle = require('../util/shuffle')

function WaltersMuseum () {
  const perPage = 100

  ApiTemplate.call(this, {
    perPage,
    endpoint: 'http://api.thewalters.org/v1/objects',
    endpointParams: '?apikey=ar9kcanGaRe3Wk4b5wyNdcqZJgYS7VQoQihXukTZPGwtHrxG78hfCZJx1aQv1K95',
    nextPage: 1,
    pageParam: '&page=1'
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
}

WaltersMuseum.prototype = Object.assign(ApiTemplate.prototype)
WaltersMuseum.prototype.constructor = ApiTemplate

WaltersMuseum.prototype
.onCollectionResponse = function () {
  if (this.req.status !== 200) return this.onError(this.req.status)

  this.cache = this.req.response.Items

  shuffle(this.cache)

  if (this.req.response.NextPage) ++this.nextPage
  else this.nextPage = 0

  return this.next()
}

WaltersMuseum.prototype
.handleItemTransform = function (next) {
  let obj

  do { obj = this.cache.pop() }
  while (!obj.PrimaryImage || !obj.PrimaryImage.Raw)

  validateImg({
    url: obj.PrimaryImage.Raw,
    minHeight: window.innerHeight * window.devicePixelRatio * 0.55,
    minWidth: window.innerWidth * window.devicePixelRatio * 0.55
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
