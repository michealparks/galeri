const bg0 = document.getElementById('bg-0')
const bg1 = document.getElementById('bg-1')
const BGstyle = [bg0.style, bg1.style]
const BG_CL = [bg0.classList, bg1.classList]
const img = document.createElement('img')

let i = 0
let __resolve

img.onload = () => {
  if (__dev__) console.log('onload()')

  const width = img.naturalWidth
  const height = img.naturalHeight

  i ^= 1
  BG_CL[i].toggle('bg-top', height > width)
  BGstyle[i].backgroundImage = `url("${img.src}")`

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showBackground, width > height ? width / 1.5 : height / 1.5)
}

img.onerror = (err) => {
  if (__dev__) console.error(err)

  return __resolve(false)
}

const showBackground = () => {
  if (__dev__) console.log('showBackground()')

  BG_CL[1].toggle('bg-active', i === 1)

  __resolve(true)

  setTimeout(removeLastImgRef, 4000)
}

const removeLastImgRef = () => {
  BGstyle[i ^ 1].removeProperty('background-image')
}

export const addImage = (src) => new Promise(resolve => {
  img.src = src
  __resolve = resolve
})
