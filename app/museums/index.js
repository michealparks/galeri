const api = require('./api')

const getNextArtwork = (next) => {
  const method = Math.random() < 0.1 ? 'rares' : 'artworks'

  api[method][Math.floor(Math.random() * api[method].length)](next)
}

module.exports = getNextArtwork
