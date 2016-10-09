const { knuthShuffle } = require('knuth-shuffle')
const validateImage = require('./validate-image')
const perPage = 20
const endpoint = 'http://metmuseum.org/api/collection/search'
const randSeed = Math.ceil(Math.random() * perPage)
const apiInterface = require('./api-interface')({
  endpoint,
  endpointParams: `?q=oil%20on%20canvas&perPage=${perPage}`,
  nextPage: randSeed,
  pageParam: `&page=${randSeed}`
})

apiInterface.onCollectionResponse = function onCollectionResponse (response, next) {
  console.log(response, this.nextPage)
  this.cache = knuthShuffle(response.results)

  if (!this.viewedPages || !this.viewedPages.length) {
    this.totalPages = Math.ceil(response.totalResults / perPage)
    this.viewedPages = []

    for (let i = 0, l = this.totalPages; i < l; ++i) {
      if (i !== this.nextPage) this.viewedPages.push(i)
    }

    knuthShuffle(this.viewedPages)
  }

  this.nextPage = this.viewedPages.pop()

  this.pageParam = `&page=${this.nextPage}`
  return next()
}.bind(apiInterface)

apiInterface.handleItemTransform = function handleItemTransform (next) {
  const obj = this.cache.pop()

  return validateImage({
    url: obj.image.replace('web-thumb', 'original'),
    minHeight: window.innerHeight * window.devicePixelRatio * 0.7,
    minWidth: window.innerWidth * window.devicePixelRatio * 0.7
  }, function (err, data) {
    if (err) return next(err)

    next(null, {
      title: obj.title,
      text: obj.subTitle,
      img: data.url,
      naturalHeight: data.naturalHeight,
      naturalWidth: data.naturalWidth
    })
  })
}.bind(apiInterface)

module.exports = apiInterface
