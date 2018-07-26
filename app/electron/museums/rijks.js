import {
  restoreData,
  getNextPages,
  getArtInScreenSize,
  fetchUrl
} from './helpers'

import {rijks as key} from './keys'
import {shuffle} from './util'

const perPage = 30
const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'rijks_painting:type=painting',
  'rijks_drawing:material=paper&type=drawing&technique=brush'
], artworks, nextPages, page, 20)

export const rijksConfig = (category) => ({
  artworks: artworks[category],
  nextPages: nextPages[category],
  page: page[category]
})

export const rijksArt = async (category) => {
  console.log('rijksArt()')
  const data = await getData(category)

  if (data === undefined) return

  const id = data.objectNumber
  const art = await fetchUrl(detailsUrl(id))

  if (art === undefined) return

  const {webImage, principalMaker, title} = art.artObject

  if (webImage === null) return

  data.img = webImage.url
  data.title = title
  data.text = principalMaker

  return data
}

const getData = async (category) => {
  console.log('rijks.getData()')
  const data = getArtInScreenSize(artworks[category])

  if (data !== undefined) return data

  const url = collectionUrl(category)
  const response = await fetchUrl(url)

  if (response === undefined) return

  storeCollection(response.artObjects, response.count, category)
}

const storeCollection = (collection, count, category) => {
  console.log('rijks.storeCollection()')
  for (let art, i = 0, r = collection || [], l = r.length; i < l; ++i) {
    art = r[i]

    const {webImage, links} = art

    if (webImage === null || webImage === undefined) continue
    if (links === null || links === undefined) continue

    artworks[category].push({
      source: 'Rijksmuseum',
      href: links.web,
      objectNumber: art.objectNumber,
      img: '',
      ext: '.png',
      filepath: '',
      naturalWidth: webImage.width,
      naturalHeight: webImage.height,
      title: '',
      text: ''
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    nextPages[category] = getNextPages(page[category], count, perPage)
  }

  page[category] = nextPages[category].pop()
}

const collectionUrl = (category) => (
  'https://www.rijksmuseum.nl/api/en/collection' +
  '?key=' + key +
  '&format=json&ps=' + perPage +
  '&p=' + page[category] +
  '&imgonly=True&' + category
)

const detailsUrl = (objectNumber) => (
  'https://www.rijksmuseum.nl/api/en/collection/' +
  objectNumber + '?key=' +
  key + '&format=json'
)
