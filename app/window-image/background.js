const images = [
  document.getElementById('img-0'),
  document.getElementById('img-1')
]

let i = 0
let __resolve

images[0].onload = images[1].onload = () => {
  if (__dev__) console.log('onload()')

  const width = images[i].naturalWidth
  const height = images[i].naturalHeight

  i ^= 1
  images[i].classList.toggle('bg-top', height > width)

  // Give a ms per pixel-row/column for rendering time
  setTimeout(showBackground, width > height ? width / 1.5 : height / 1.5)
}

images[0].onerror = images[0].onerror = (err) => {
  if (__dev__) console.error(err)

  return __resolve(false)
}

const showBackground = () => {
  if (__dev__) console.log('showBackground()')

  images[1].classList.toggle('bg-active', i === 1)

  __resolve(true)

  setTimeout(removeLastImgRef, 4000)
}

const removeLastImgRef = () => {
  images[i ^ 1].style.removeProperty('background-image')
}

export const addImage = (src) => new Promise(resolve => {
  images[i].src = src
  __resolve = resolve
})
