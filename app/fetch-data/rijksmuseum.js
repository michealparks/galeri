const { get } = require('https')
const { knuthShuffle } = require('knuth-shuffle')
const rijksUrl = 'https://www.rijksmuseum.nl/api/en/collection?key=xPauC1vP&format=json&ps=100&type=painting&imgonly=True'

let hasInit = false
let queue
let writeToConfig
let currentPage = 0
let totalPages
let cache = []

const provideRijksMuseumConfig = ({ page, results }, write) => {
  hasInit = true
  currentPage = page
  cache = results
  writeToConfig = write

  if (queue) getNextRijksMuseumImage(queue)
}

const getRijksMuseumData = (page, callback) =>
  get(`${rijksUrl}&p=${page}`, res => {
    let body = ''

    res.on('data', d => { body += d })
    res.on('end', () => callback(null, JSON.parse(body)))
  }).on('error', callback)

const getNextPageResults = callback => {
  currentPage = currentPage + 1 > totalPages ? 0 : ++currentPage

  getRijksMuseumData(currentPage, (err, { count, artObjects }) => {
    if (err) return callback(err)

    totalPages = Math.ceil(count / 100)
    cache = knuthShuffle(artObjects)

    writeToConfig({
      page: currentPage,
      results: cache
    })
    callback()
  })
}

const getNextRijksMuseumImage = callback => {
  if (!hasInit) { queue = callback; return }
  if (!cache.length) return getNextPageResults(() => getNextRijksMuseumImage(callback))

  const nextImage = cache.pop()
  nextImage.img = nextImage.webImage.url

  callback(null, nextImage)
}

module.exports = {
  provideRijksMuseumConfig,
  getNextRijksMuseumImage
}
