const loadImage = require('./load')
const { getDescription } = require('./wikipedia')
const image = document.createElement('img')

const getProps = (images) => {
  const rand = Math.round(Math.random() * (images.length - 1))
  const { img, href, title } = images[rand]

  return Promise.all([
    loadImage(img),
    getDescription(href)
  ])
  .then(([url, content]) => new Promise((res, rej) => {
    image.onerror = e => rej(e)
    image.onload = () => {
      const { height, width } = image

      if (width < 1000 || height < 1000) rej('Too small!')
      console.log(image.height, image.width)

      res({
        title,
        content,
        img: url,
        position: image.height > image.width ? 'top' : 'center'
      })
    }
    image.src = url
  }))
  .catch(err => {
    console.error(err)
    return getProps(images)
  })
}

module.exports = getProps
