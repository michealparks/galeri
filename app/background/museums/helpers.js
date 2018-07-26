import shuffle from '../util/shuffle'
import storage from '../util/storage'
import {screenWidth, screenHeight} from '../util/screen'

const museumData = (() => {
  const configVersion = '0.0.2'
  const config = storage('MUSEUMS') || {}
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
  const sw = screenWidth()
  const sh = screenHeight()

  while (works.length > 0) {
    const pending = works.pop()

    if (pending.naturalWidth >= sw &&
        pending.naturalHeight >= sh) {
      return pending
    }
  }
}
