const ApiTemplate = require('./api-template')
const validate = require('../util/img-size')
const keys = require('./api-keys')

function WaltersMuseum () {
  ApiTemplate.call(this, {
    config: 'waltersMuseum',
    perPage: 100,
    nextPage: 1,
    endpoint: 'http://api.thewalters.org/v1/objects',
    endpointParams: `?apikey=${keys.WALTERS_MUSEUM}&classification=painting`,
    pageParam: '&page=1'
  })
}

WaltersMuseum.prototype = Object.create(ApiTemplate.prototype)
WaltersMuseum.prototype.constructor = ApiTemplate
WaltersMuseum.prototype.handleItemTransform = handleItemTransform
WaltersMuseum.prototype.handleCollectionData = handleCollectionData

function handleCollectionData () {
  this.cache = []

  for (let art, i = 0, r = this.req.response.Items || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (!art.PrimaryImage || !art.PrimaryImage.Raw) continue

    this.cache.push({
      source: 'The Walters Art Museum',
      href: art.ResourceURL,
      title: art.Title,
      text: art.Creator,
      img: `${art.PrimaryImage.Raw}?quality=100&format=jpg`
    })
  }

  if (this.req.response.NextPage) {
    this.nextPage += 1
  } else {
    this.nextPage = 0
  }

  this.pageParam = `&page=${this.nextPage}`
}

function handleItemTransform (next) {
  let art = this.cache.pop()

  validate(art.img, this.minHeight, this.minWidth, function (err, data) {
    if (err) return next(err)

    art.naturalHeight = data.height
    art.naturalWidth = data.width

    next(null, art)
  })
}

module.exports = new WaltersMuseum()
