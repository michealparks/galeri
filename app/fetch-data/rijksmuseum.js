const { get } = require('https')
const { knuthShuffle } = require('knuth-shuffle')
const endpoint = 'https://www.rijksmuseum.nl/api/en/collection'
const dataParameters = 'key=xPauC1vP&format=json&ps=100&imgonly=True'
const artWorkParameters = 'type=painting'
const rijksUrl = `${endpoint}?${dataParameters}&${artWorkParameters}`

let hasInit = false
let queue
let writeToConfig
let currentPage = 0
let totalPages
let cache = []

window.addEventListener('beforeunload', e => {
  writeToConfig({
    page: currentPage,
    results: cache
  })
})

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

    return callback()
  })
}

const getNextRijksMuseumImage = callback => {
  if (!hasInit) { queue = callback; return }
  if (!cache.length) {
    return getNextPageResults(err => {
      if (err) return callback(err)

      return getNextRijksMuseumImage(callback)
    })
  }

  const nextImage = cache.pop()

  if (nextImage.webImage === null ||
      nextImage.webImage.width < window.innerWidth ||
      nextImage.webImage.height < window.innerHeight) {
    if (!nextImage.webImage) console.error('rijks: too small!')
    return getNextRijksMuseumImage(callback)
  }

  const text = nextImage.longTitle.split(',')

  return callback(null, {
    img: nextImage.webImage.url,
    naturalWidth: nextImage.webImage.width,
    naturalHeight: nextImage.webImage.height,
    title: text[0],
    text: text.slice(1).join(', '),
    content: `
      <h3>${text[0]}</h3>
      <p>${text.slice(1).join(', ')}</p>
    `
  })
}

module.exports = {
  provideRijksMuseumConfig,
  getNextRijksMuseumImage
}
