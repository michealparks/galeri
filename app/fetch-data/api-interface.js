/* global XMLHttpRequest */

/**
 * Individual APIs are responsible for the following funcs:
 *   - onColllectionResponse(response<object>, next<function>)
 *       1. set this.cache and this.nextPage here, as well as other
 *          more specific props
 *   - handleItemTransform(objects<array>, next<function>)
 *       1. call next() and pass in a single argument of an object
 *          of an artwork ready to be consumed by the renderer
 */
function getConfig () {
  return {
    page: this.nextPage,
    results: this.cache
  }
}

function giveConfig (config) {
  this.hasInit = true
  this.nextPage = config.page || this.nextPage
  this.cache = config.results

  if (this.queue) this.getItemData(this.queue)
}

function getCollectionData (next) {
  this.next = next
  this.req = new XMLHttpRequest()
  console.log(`${this.endpoint}${this.endpointParams}${this.pageParam}`)
  this.req.open('GET', `${this.endpoint}${this.endpointParams}${this.pageParam}`, true)
  this.req.responseType = 'json'

  for (let i = 0, h, l = this.headers.length; i < l; ++i) {
    h = this.headers[i]
    this.req.setRequestHeader(h.key, h.val)
  }

  this.req.addEventListener('load', this.onload)
  this.req.addEventListener('error', next)
  this.req.send()
}

function onload () {
  this.onCollectionResponse(this.req.response, this.next)
}

function getItemData (next) {
  if (!this.hasInit) {
    this.queue = next
  }

  if (!this.cache.length) {
    return this.getCollectionData(err => {
      if (err) return next(err)

      return this.getItemData(next)
    })
  }

  this.handleItemTransform(next)
}

function apiInterface (config) {
  const obj = {}

  obj.hasInit = false
  obj.req = null
  obj.cache = []
  obj.endpoint = config.endpoint
  obj.endpointParams = config.endpointParams || ''
  obj.headers = config.headers || []
  obj.nextPage = config.nextPage
  obj.perPage = config.perPage || 100
  obj.pageParam = config.pageParam || ''
  obj.getConfig = getConfig.bind(obj)
  obj.giveConfig = giveConfig.bind(obj)
  obj.getCollectionData = getCollectionData.bind(obj)
  obj.getItemData = getItemData.bind(obj)
  obj.onload = onload.bind(obj)

  return obj
}

module.exports = apiInterface
