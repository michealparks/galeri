module.exports = {restoreData, getCollection, getNextPages}

const http2 = require('http2')
const shuffle = require('../util/shuffle')

const museumData = (() => {
  const configVersion = '0.0.2'
  const config = require('../util/storage')('MUSEUMS') || {}
  return config.version === configVersion ? config : {}
})()

function restoreData (types, artworks, nextPages, page, max) {
  for (let i = 0, l = types.length; i < l; ++i) {
    const [storeKey, dataKey] = types[i].split(':')
    const data = museumData[storeKey] || {}

    artworks[dataKey] = data.artworks || []

    if (nextPages !== undefined) {
      nextPages[dataKey] = data.nextPages || []
    }

    if (page !== undefined) {
      page[dataKey] = data.page || Math.ceil(Math.random() * max)
    }
  }
}

function tryParse (body) {
  try {
    return JSON.parse(body)
  } catch (e) {
    return undefined
  }
}

function getCollection (next, url, category, responseType) {
  const errHandler = onError.bind(undefined, next)

  const request = http2.get(url, (res) => {
    if (res.status !== 200) {
      return next(1)
    }

    let body = ''
    res.on('error', errHandler)
    res.on('data', (d) => { body += d })
    res.on('end', () => next(undefined, tryParse(body), category))
  })

  request.on('error', errHandler)
  request.setTimeout(10000)

  return request
}

function getNextPages (currentPage, totalPages, startPage) {
  const nextPages = []

  for (let i = startPage || 0; i < totalPages; ++i) {
    if (i !== currentPage) nextPages.push(i)
  }

  shuffle(nextPages)

  return nextPages
}

function onError (next, e) {
  if (__dev__) console.warn(e)
  next(1)
}
