const images = []

const loadImage = url => new Promise((res, rej) => {
  images.pop()
  images.unshift(document.createElement('img'))

  const img = images[0]

  img.onerror = e => rej(e)
  img.onload = () => {
    const { height, width } = img

    if (width < 1000 || height < 1000) rej('Too small!')

    res({ url, height, width })
  }

  img.src = url
})

module.exports = loadImage
