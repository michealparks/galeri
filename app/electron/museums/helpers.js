import {getScreenSize, shuffle} from './util'
import fetch from 'node-fetch'

export const fetchUrl = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
      },
      timeout: 10000
    })
    const json = await res.json()

    return json
  } catch (err) {
    console.error('fetch error: ', err)
  }
}

const museumData = (() => {
  const configVersion = '0.0.2'
  // TODO
  const config = {}
  return config.version === configVersion ? config : {}
})()

export const restoreData = (types, artworks, nextPages, page, max) => {
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

export const getNextPages = (currentPage, totalPages, startPage) => {
  const nextPages = []

  for (let i = startPage || 0; i < totalPages; ++i) {
    if (i !== currentPage) {
      nextPages.push(i)
    }
  }

  shuffle(nextPages)

  return nextPages
}

export const getArtInScreenSize = (works) => {
  const {width, height} = getScreenSize()

  while (works.length > 0) {
    const pending = works.pop()

    if (pending.naturalWidth >= width &&
        pending.naturalHeight >= height) {
      return pending
    }
  }
}
