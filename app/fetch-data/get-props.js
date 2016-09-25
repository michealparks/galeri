const loadImage = require('./load')
const { getDescription } = require('./wikipedia')

const getProps = (images) => {
  const rand = Math.round(Math.random() * (images.length - 1))
  const { img, href, title } = images[rand]

  return Promise.all([
    loadImage(img),
    getDescription(href)
  ]).then(([url, content]) => ({
    img: url,
    content,
    title
  })).catch(err => {
    console.error(err)
    return getProps(images)
  })
}

module.exports = getProps
