const {nativeImage} = require('electron')
const shuffle = require('../util/shuffle')
const fetchImage = require('../util/fetch-image')
const imageFilename = require('../util/image-filename')
const apis = require('./config')
const sources = Object.keys(apis)

const fetchArt = (next) => {
  const source = sources[Math.random() * sources.length | 0]
  const api = apis[source]
  const artwork = api.artworks.pop()
  const page = api.pages.pop()

  if (artwork) return downloadArt(artwork, next)

  api.get(api.type, page, api.perPage, (err, results, count) => {
    if (err) {
      if (__dev__) {
        console.error('ERROR fetchArt: ', api.type, ' ', err)
      }

      return fetchArt(next)
    }

    if (api.isPaginated && api.pages.length === 0) {
      api.pages = getPages(count, page, api.perPage, api.start)
    }

    api.artworks = results

    shuffle(api.artworks)
    downloadArt(api.artworks.pop(), next)
  })
}

const fetchRareArt = (next) => {

}

const downloadArt = (artwork, next) => {
  const {title, text, imgsrc} = artwork

  artwork.localsrc = imageFilename(title, text, imgsrc)

  fetchImage(imgsrc, artwork.localsrc, (err) => {
    if (err) {
      if (__dev__) console.error('Image fetch error: ', err)
      fetchArt(next)
    } else {
      if (true || artwork.width === -1) {
        const img = nativeImage.createFromPath(artwork.localsrc).getSize()
        artwork.height = img.height
        artwork.width = img.width
      }

      next(artwork)
    }
  })
}

const initAPIs = (data) => {
  for (let i = sources.length - 1; i > -1; i -= 1) {
    apis[sources[i]].artworks = data[sources[i]].artworks
  }
}

const getPages = (count, page, perPage, start = 0) => {
  const total = Math.ceil(count / perPage)
  const pages = []

  for (let i = start; i < total; i += 1) {
    if (i !== page) pages.push(i)
  }

  shuffle(pages)

  return pages
}

module.exports = {fetchArt, fetchRareArt, initAPIs}
