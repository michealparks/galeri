/* global XMLHttpRequest */
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const ApiTemplate = require('./api-template')

// TODO get total pages from this request
// const xhr = new XMLHttpRequest()
// xhr.open('GET', `${endpoint}/object/?total_count_only=1`, true)
// xhr.setRequestHeader('api_key', apiKey)
// xhr.responseType = 'json'
// xhr.onload = () => console.log(xhr.response.data)
// xhr.send()

function BrooklynMuseum () {
  ApiTemplate.call(this, {
    headers: [{ key: 'api_key', val: 'I12CaDlDkZXczvBro5tPQZpv0X2ZRHAQ' }],
    endpoint: 'https://www.brooklynmuseum.org/api/v2',
    endpointParams: '/object?limit=35&has_images=1&rights_type_permissive=1',
    nextPage: 1,
    pageParam: '&offset=0'
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
}

BrooklynMuseum.prototype = Object.create(ApiTemplate.prototype)
BrooklynMuseum.prototype.constructor = ApiTemplate

BrooklynMuseum.prototype.onCollectionResponse = function () {
  this.cache = []

  for (let i = 0, l = this.req.response.data.length, r; i < l; i++) {
    r = this.req.response.data[i]
    if (r.classification === 'Painting' ||
        r.classification === 'Work on Paper' ||
        r.classification === 'Drawing') this.cache.push(r)
  }

  knuthShuffle(this.cache)

  this.nextPage = this.nextPage + 1
  return this.next()
}

BrooklynMuseum.prototype.handleItemTransform = function handleItemTransform (next) {
  const obj = this.cache.pop()

  return validateImage({
    url: `https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/${obj.primary_image}`,
    minHeight: window.innerHeight * window.devicePixelRatio * 0.6,
    minWidth: window.innerWidth * window.devicePixelRatio * 0.6
  }, function (err, data) {
    if (err) return next(err)

    next(null, {
      title: obj.title,
      text: obj.artists.reduce(function (str, artist, i) {
        return str + (i === 0 ? artist.name : `, ${artist.name}`)
      }, '') + `, ${obj.object_date}.`,
      img: data.url,
      naturalHeight: data.naturalHeight,
      naturalWidth: data.naturalWidth
    })
  })
}

module.exports = new BrooklynMuseum()
