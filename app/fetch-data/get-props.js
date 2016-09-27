const { ipcRenderer } = require('electron')
const loadImage = require('./load')
const { getDescription } = require('./wikipedia')

const getProps = ({ img, href, title }) => Promise.all([
  loadImage(img),
  getDescription(href)
]).then(([{ height, width, url }, content]) => {
  const props = {
    title,
    content,
    img: url,
    position: height > width ? 'top' : 'center'
  }

  ipcRenderer.send('next-image-done', props)

  return props
})

module.exports = getProps
