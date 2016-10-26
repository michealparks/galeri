const { isJPG } = require('./jpg')
const { isPNG } = require('./png')

function detector (buffer) {
  if (isJPG(buffer)) return 'jpg'
  if (isPNG(buffer)) return 'png'
}

module.exports = detector
