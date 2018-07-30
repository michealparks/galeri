import {getScreenSize, shuffle} from '../../util'

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
