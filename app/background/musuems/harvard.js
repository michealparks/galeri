const ApiTemplate = require('./api-template')
const validate = require('../util/img-size')
const shuffle = require('../util/shuffle')
const keys = require('./api-keys')

function HarvardMuseum (config, type) {
  const perPage = 50

  ApiTemplate.call(this, {
    config: config,
    perPage: perPage,
    endpoint: 'http://api.harvardartmuseums.org/object',
    endpointParams: `?apikey=${keys.HARVARD_MUSEUM}&size=${perPage}&medium=${type}&hasimage=1`,
    nextPage: 1,
    pageParam: '&page=1'
  })
}

HarvardMuseum.prototype = Object.create(ApiTemplate.prototype)
HarvardMuseum.prototype.constructor = ApiTemplate
HarvardMuseum.prototype.handleItemTransform = handleItemTransform
HarvardMuseum.prototype.handleCollectionData = handleCollectionData
HarvardMuseum.prototype.hueRegex = /Grey|Black|White/

function handleCollectionData () {
  this.cache = []

  for (let art, i = 0, r = this.req.response.records || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (!art.primaryimageurl ||
        !art.colors ||
        art.colors.every((d) => this.hueRegex.test(d.hue))) continue

    this.cache.push({
      source: 'Harvard Art Museums',
      href: art.url,
      title: art.title,
      text: art.people && art.people[0] ? art.people[0].name : '',
      img: `${art.primaryimageurl}?width=3000&height=3000`
    })
  }

  if (!this.nextPages.length) {
    this.totalPages = this.req.response.info.pages
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
  let art = this.cache.pop()

  return validate(art.img, this.minHeight, this.minWidth, function (err, data) {
    if (err) return next(err)

    art.naturalWidth = data.width
    art.naturalHeight = data.height

    return next(null, art)
  })
}

module.exports = {
  Oil: new HarvardMuseum(
    'harvardOil',
    encodeURIComponent('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor')
  )
}
