import {harvard as apiKey} from './keys'
import {restoreData, getNextPages, fetchUrl} from './helpers'
import {shuffle, getScreenSize} from './util'

const hueRegex = /Grey|Black|White/
const perPage = 30
const artworks = {}
const nextPages = {}
const page = {}

restoreData([
  'harvard_painting:Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor'
], artworks, nextPages, page, 20)

export const harvardConfig = (category) => ({
  artworks: artworks[category],
  nextPages: nextPages[category],
  page: page[category]
})

export const harvardArt = (category) => {
  if (__dev__) console.log('harvardArt()')

  return getData(category)
}

const getData = async (category) => {
  const data = artworks[category].pop()

  if (data !== undefined) return data

  const url = collectionUrl(category)
  const response = await fetchUrl(url)

  if (response === undefined) return

  storeCollection(response.records, response.totalResults, category)
}

const storeCollection = (collection, count, category) => {
  const size = getScreenSize()

  for (let art, i = 0, r = collection || [], l = r.length; i < l; ++i) {
    art = r[i]

    const {images, colors} = art

    if (images === null || images === undefined) continue

    const [image] = images

    if (image === null || image === undefined) continue
    if (colors === null || colors === undefined) continue

    const {height, width, baseimageurl} = image

    let hasColor = false
    for (let i = 0, l = colors.length; i < l; i++) {
      if (hueRegex.test(colors[i].hue) === false) {
        hasColor = true
        break
      }
    }

    if (hasColor === false) continue

    artworks[category].push({
      source: 'Harvard Art Museums',
      href: art.url,
      img: `${baseimageurl}?width=${size.width}&height=${size.height}`,
      ext: '.png',
      naturalWidth: width,
      naturalHeight: height,
      title: art.title,
      text: art.people && art.people[0] ? art.people[0].name : '',
      isFavorited: false
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const totalPages = Math.ceil(count / perPage)
    nextPages[category] = getNextPages(page[category], totalPages, 0)
  }

  page[category] = nextPages[category].pop()
}

const collectionUrl = (category) => (
  'http://api.harvardartmuseums.org/object' +
  '?apikey=' + apiKey +
  '&size=' + perPage +
  '&page=' + page[category] +
  '&medium=' + category
)
