
const loadImage = url => new Promise((res, rej) => {
  let img = document.createElement('img')

  img.onerror = e => rej(e)
  img.onload = () => {
    const { height, width } = img

    if (width < 1000 || height < 1000) rej('Too small!')

    res({ url, height, width })
  }

  img.src = url
})

module.exports = loadImage
