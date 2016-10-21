/* global XMLHttpRequest, URL */
const BG = [document.getElementById('bg_0'), document.getElementById('bg_1')]
const BGstyle = [BG[0].style, BG[1].style]
const BG_CL = [BG[0].classList, BG[1].classList]

let i = 0
let req, objectURL
let _next, _data, _naturalWidth, _naturalHeight

function fillBG (data, next) {
  _naturalWidth = data.naturalWidth
  _naturalHeight = data.naturalHeight
  _next = next
  _data = data
  return requestImage(`${data.img}?${Date.now()}`)
}

function requestImage (url) {
  req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.timeout = 5000
  req.responseType = 'blob'
  req.onprogress = onProgress
  req.onload = onPreload
  req.onerror = onError
  return req.send()
}

function onProgress () {

}

function onError (msg) {
  return _next({
    errType: 'warn',
    file: 'background/fill-bg.js',
    fn: 'fillBG()',
    msg
  })
}

function onPreload () {
  if (this.status !== 200) return onError(`HTTP status code: ${this.status}`)

  objectURL = URL.createObjectURL(this.response)
  i = (i + 1) % 2
  BG_CL[i].toggle('bg--top', _naturalHeight > _naturalWidth)
  BGstyle[i].backgroundImage = `url("${objectURL}")`

  // Give a ms per pixel for rendering time
  return setTimeout(onRender, _naturalWidth > _naturalHeight ? _naturalWidth : _naturalHeight)
}

function onRender () {
  BG_CL[1].toggle('bg--active', i === 1)
  URL.revokeObjectURL(objectURL)
  return _next(null, _data)
}

module.exports = fillBG
