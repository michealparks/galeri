/* global XMLHttpRequest */

/**
 * Individual APIs are responsible for the following funcs:
 *   - onCollectionResponse(response<object>, next<function>)
 *       1. set this.cache and this.nextPage here, as well as other
 *          more specific props
 *   - handleItemTransform(objects<array>, next<function>)
 *       1. call next() and pass in a single argument of an object
 *          of an artwork ready to be consumed by the renderer
 */

function ApiTemplate (config = {}) {
  this.didInit = false
  this.queue = null
  this.req = null
  this.cache = []
  this.perPage = config.perPage || 20
  this.nextPage = config.nextPage || 1
  this.headers = config.headers || []
  this.endpoint = config.endpoint || this.endpoint || ''
  this.endpointParams = config.endpointParams || ''
  this.pageParam = config.pageParam || ''
  console.log(config, this)

  this.onError = this.onError.bind(this)
}

ApiTemplate.prototype
.getConfig = function getConfig () {
  return {
    page: this.nextPage,
    results: this.cache,
    viewedPages: this.viewedPages,
    totalPages: this.totalPages
  }
}

ApiTemplate.prototype
.giveConfig = function giveConfig (config) {
  this.didInit = true

  if (config) {
    this.nextPage = config.page
    this.cache = config.results
    this.viewedPages = config.viewedPages
    this.totalPages = config.totalPages
  }

  if (this.queue) return this.getNextItem(this.queue)
}

ApiTemplate.prototype
.getCollectionData = function getCollectionData (next) {
  this.next = next
  this.req = new XMLHttpRequest()
  this.req.open('GET', `${this.endpoint}${this.endpointParams}${this.pageParam}`, true)
  this.req.responseType = 'json'

  for (let i = 0, h, l = this.headers.length; i < l; ++i) {
    h = this.headers[i]
    this.req.setRequestHeader(h.key, h.val)
  }

  this.req.onload = this.onCollectionResponse
  this.req.onerror = this.onError
  return this.req.send()
}

ApiTemplate.prototype
.onError = function onError (e) {
  this.next({
    errType: 'warn',
    file: 'fetch-data/api-template.js',
    fn: 'getCollectionData()',
    msg: e
  })
}

ApiTemplate.prototype
.getNextItem = function getNextItem (next) {
  if (!this.didInit) {
    this.queue = next
    return
  }

  if (!this.cache.length) {
    return this.getCollectionData(err => {
      if (err) return next(err)

      return this.handleItemTransform(next)
    })
  }

  return this.handleItemTransform(next)
}

module.exports = ApiTemplate
