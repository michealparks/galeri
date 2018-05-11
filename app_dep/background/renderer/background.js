module.exports = updateImage

const BGstyle = [window.bg_0.style, window.bg_1.style]
const BG_CL = [window.bg_0.classList, window.bg_1.classList]
const img = document.createElement('img')

let i = 0

img.onload = onload

function updateImage (src) {
  img.src = src
}

function onload () {
  const width = this.naturalWidth
  const height = this.naturalHeight

  i ^= 1
  BG_CL[i].toggle('bg-top', height > width)
  BGstyle[i].backgroundImage = `url("${this.src}")`

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showBackground, width > height ? width / 1.5 : height / 1.5)
}

function showBackground () {
  BG_CL[1].toggle('bg-active', i === 1)
  setTimeout(removeLastImgRef, 4000)
}

function removeLastImgRef () {
  BGstyle[i ^ 1].removeProperty('background-image')
}
