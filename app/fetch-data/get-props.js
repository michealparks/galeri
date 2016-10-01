const validateImage = require('./load')
const { getDescription } = require('./wikipedia')

let count
let content = ''

const getProps = ({ img, href, title }, callback) => {
  count = 0

  getDescription(href, (err, description) => {
    if (err) return callback(err)
    content = description
    if (++count === 2) callback(null, { content, img, title })
  })

  validateImage(img, (err, url) => {
    if (err) return callback(err)
    if (++count === 2) callback(null, { content, img, title })
  })
}

module.exports = getProps
