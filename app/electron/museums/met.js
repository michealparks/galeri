import {restoreData, getNextPages, fetchUrl} from './helpers'
import {shuffle} from './util'

const perPage = 20
const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'met_acrylic:acrylic on canvas',
  'met_oil:oil on canvas',
  'met_ink:ink and color on paper'
], artworks, nextPages, page, 20)

export const metConfig = (category) => ({
  artworks: artworks[category],
  nextPages: nextPages[category],
  page: page[category]
})

export const metArt = (category) => {
  if (__dev__) console.log('metArt()')

  return getData(category)
}

const getData = async (category) => {
  const art = artworks[category].pop()

  if (art !== undefined) return art

  const url = collectionUrl(category)
  const response = await fetchUrl(url)

  if (response === undefined) return

  storeCollection(response.results, response.totalResults, category)
}

const storeCollection = (collection, count, category) => {
  for (let i = 0, art, l = collection.length; i < l; i++) {
    art = collection[i]

    let {image, subTitle} = art

    if (image === null || image === undefined) continue
    if (subTitle === null || subTitle === undefined) continue
    if (image.indexOf('.ashx') !== -1) continue
    if (image.indexOf('NoImageAvailableIcon.png') !== -1) continue

    if (image.indexOf('http') === -1) {
      image = 'https://metmuseum.org/' + image
    } else {
      image = image.replace('http', 'https')
    }

    image = image
      .replace('web-thumb', 'original')
      .replace('mobile-large', 'original')

    artworks[category].push({
      source: 'The Metropolitan Museum of Art',
      href: `http://metmuseum.org${art.url}`,
      img: image,
      ext: '.png',
      title: art.title,
      text: subTitle,
      naturalWidth: 0,
      naturalHeight: 0,
      isFavorited: false
    })

    shuffle(artworks[category])

    if (nextPages[category].length === 0) {
      const totalPages = Math.ceil(count / perPage)
      nextPages[category] = getNextPages(page[category], totalPages, 0)
    }

    page[category] = nextPages[category].pop()
  }
}

const collectionUrl = (category) => (
  'https://metmuseum.org/api/collection/search' +
  '?q=' + encodeURIComponent(category) +
  '&perPage=' + perPage +
  '&page=' + page[category]
)
