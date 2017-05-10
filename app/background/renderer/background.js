module.exports = fill

const bg0 = document.getElementById('bg_0')
const bg1 = document.getElementById('bg_1')
const BGstyle = [bg0.style, bg1.style]
const BG_CL = [bg0.classList, bg1.classList]

let i = 0
let callbackRef
let img = document.createElement('img')

img.onerror = onerror
img.onload = onload

function fill (data, next) {
  callbackRef = next
  img.src = data.img
}

function onerror (e) {
  if (__dev__) console.warn('image loading error', e)
  callbackRef(1)
}

function onload () {
  const width = this.naturalWidth
  const height = this.naturalHeight

  i ^= 1
  BG_CL[i].toggle('bg--top', height > width)
  BGstyle[i].backgroundImage = `url("${this.src}")`

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showBackground, width > height ? width / 1.5 : height / 1.5)
}

function showBackground () {
  BG_CL[1].toggle('bg--active', i === 1)
  setTimeout(removeLastImgRef, 4000)
  callbackRef()
}

function removeLastImgRef () {
  BGstyle[i ^ 1].removeProperty('background-image')
}
