const loadImage = require('./load')
const { getDescription } = require('./wikipedia')

const getProps = ({ img, href, title }) => Promise.all([
  loadImage(img),
  getDescription(href)
]).then(([{ height, width, url }, content]) => ({
  title,
  content,
  width,
  height,
  img: url,
  position: height > width ? 'top' : 'center'
}))

module.exports = getProps
