const bg0 = document.getElementById('bg-0')
const bg1 = document.getElementById('bg-1')
const BGstyle = [bg0.style, bg1.style]
const BG_CL = [bg0.classList, bg1.classList]

let i = 0
let __resolve
let img = document.createElement('img')

const onerror = (e) => {
  if (__dev__) console.warn('image loading error', e)
  __resolve(e)
}

const onload = () => {
  if (__dev__) console.log('onload()')

  const width = img.naturalWidth
  const height = img.naturalHeight

  i ^= 1
  BG_CL[i].toggle('bg-top', height > width)
  BGstyle[i].backgroundImage = `url("${img.src}")`

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showBackground, width > height ? width / 1.5 : height / 1.5)
}

const showBackground = () => {
  if (__dev__) console.log('showBackground()')

  BG_CL[1].toggle('bg-active', i === 1)
  setTimeout(removeLastImgRef, 4000)
  __resolve()
}

const removeLastImgRef = () => {
  BGstyle[i ^ 1].removeProperty('background-image')
}

const addImage = (src) => new Promise(resolve => {
  __resolve = resolve
  img.src = src
})

img.onerror = onerror
img.onload = onload

export default addImage
