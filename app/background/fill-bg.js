const BG = [
  document.getElementById('bg_0'),
  document.getElementById('bg_1')
]

const BGstyle = [BG[0].style, BG[1].style]
const BG_CL = [BG[0].classList, BG[1].classList]

const CL = document.getElementById('bg_1').classList

let i = 0
let _next, _data, _naturalWidth, _naturalHeight

const preload = new window.Image()
preload.onload = onPreload
preload.onerror = onError

function onPreload () {
  i = (i + 1) % 2
  BG_CL[i].toggle('bg--top', _naturalHeight > _naturalWidth)
  BGstyle[i].backgroundImage = `url("${preload.src}?${Date.now()}")`

  // Give a ms per pixel for rendering time
  setTimeout(onRender, _naturalWidth > _naturalHeight ? _naturalWidth : _naturalHeight)
}

function onRender () {
  CL.toggle('bg--active', i === 1)
  _next(_data)
}

function onError (msg) {
  _next({
    errType: 'warn',
    file: 'background/fill-bg.js',
    fn: 'fillBG()',
    msg
  })
}

function fillBG (data, next) {
  _naturalWidth = data.naturalWidth
  _naturalHeight = data.naturalHeight
  _next = next
  _data = data
  preload.src = `${data.img}?${Date.now()}`
}

module.exports = fillBG
