/* global XMLHttpRequest */
const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const endpoint = 'https://www.brooklynmuseum.org/api/v2'
const apiKey = 'I12CaDlDkZXczvBro5tPQZpv0X2ZRHAQ'
const apiInterface = require('./api-interface')({
  headers: [{ key: 'api_key', val: apiKey }],
  endpoint,
  endpointParams: '/object?limit=35&has_images=1&rights_type_permissive=1',
  nextPage: 1,
  pageParam: '&offset=0'
})

const xhr = new XMLHttpRequest()
xhr.open('GET', `${endpoint}/object/?total_count_only=1`, true)
xhr.setRequestHeader('api_key', apiKey)
xhr.responseType = 'json'
xhr.onload = () => console.log(xhr.response.data)
xhr.send()

apiInterface.onCollectionResponse = function onCollectionResponse (response, next) {
  this.cache = []

  for (let i = 0, l = response.data.length, r; i < l; i++) {
    r = response.data[i]
    if (r.classification === 'Painting' ||
        r.classification === 'Work on Paper' ||
        r.classification === 'Drawing') this.cache.push(r)
  }

  knuthShuffle(this.cache)

  this.nextPage = this.nextPage + 1
  return next()
}.bind(apiInterface)

apiInterface.handleItemTransform = function handleItemTransform (next) {
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
}.bind(apiInterface)

module.exports = apiInterface
