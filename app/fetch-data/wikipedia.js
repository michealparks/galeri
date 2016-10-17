/* global XMLHttpRequest */
const ApiTemplate = require('./api-template')
const validateImg = require('../util/validate-img')
const shuffle = require('../util/shuffle')

function Wikipedia (type) {
  ApiTemplate.call(this, {
    endpointParams: `?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/${type}&format=json&origin=*`
  })

  this.onCollectionResponse = this.onCollectionResponse.bind(this)
  this.onDescriptionLoad = this.onDescriptionLoad.bind(this)
}

Wikipedia.prototype = Object.create(ApiTemplate.prototype)
Wikipedia.prototype.constructor = ApiTemplate

Wikipedia.prototype.template = document.createElement('template')
Wikipedia.prototype.endpoint = 'https://en.wikipedia.org/w/api.php'
Wikipedia.prototype.pixelRegex = /[0-9]{3,4}px/
Wikipedia.prototype.parenRegex = / *\([^)]*\) */g

Wikipedia.prototype
.onCollectionResponse = function () {
  if (!this.req.response) {
    return this.next({
      errType: 'error',
      file: 'fetch-data/wikipedia.js',
      fn: 'onCollectionResponse()',
      msg: 'No Wikipedia Content.'
    })
  }

  this.template.innerHTML = this.req.response.parse.text['*']

  const gallerytext = this.template.content.querySelectorAll('.gallerytext')

  this.cache = [].slice
    .call(this.template.content.querySelectorAll('.gallery img'))
    .map((tag, i) => {
      const a = gallerytext[i].querySelectorAll('a')

      return {
        title: a[0].getAttribute('title'),
        text: a[1] ? a[1].getAttribute('title') : '',
        href: `https://wikipedia.org${a[0].getAttribute('href')}`,
        img: `https:${tag.getAttribute('src')}`
      }
    })

  shuffle(this.cache)

  return this.next()
}

Wikipedia.prototype
.handleItemTransform = function (next) {
  this.nextImage = this.cache.pop()
  // this.getDescription(this.nextImage.href.replace('https://wikipedia.org/wiki/', ''))

  return validateImg(
    this.nextImage.img.replace(this.pixelRegex, `${window.innerWidth * window.devicePixelRatio * 0.8}px`),
    (err, data) => err ? next(err) : next(null, {
      source: 'Wikipedia',
      href: this.nextImage.href,
      title: this.nextImage.title.replace(this.parenRegex, ''),
      text: this.nextImage.text.replace(this.parenRegex, ''),
      img: data.url,
      naturalHeight: data.naturalHeight,
      naturalWidth: data.naturalWidth
    }))
}

Wikipedia.prototype
.getDescription = function (title) {
  this.desReq = new XMLHttpRequest()
  this.desReq.open('GET', `${this.endpoint}?action=parse&prop=text&page=${title}&format=json&origin=*`, true)
  this.desReq.responseType = 'json'
  this.desReq.onload = this.onDescriptionLoad
  this.desReq.send()
}

Wikipedia.prototype
.onDescriptionLoad = function () {
  this.template.innerHTML = this.desReq.response.parse.text['*']

  this.description = this.template.content
    .querySelector('p').innerHTML

  const text = this.template.content.querySelector('p').innerHTML.split('. ')
}

module.exports = new Wikipedia('Paintings')
