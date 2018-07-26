import {harvard as apiKey} from './keys'
import {restoreData, getNextPages} from './helpers'
import xhr from '../util/xhr'
import getDimensions from '../util/img-size'
import {screenWidth, screenHeight} from '../util/screen'
import shuffle from '../util/shuffle'

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
  let data

  // todo confusing, refactor
  while (artworks[category].length > 0) {
    let pending = artworks[category].pop()
    let sWidth = screenWidth()
    let sHeight = screenHeight()

    if (pending.naturalWidth === 0) {
      pending.img = `${pending.img}?width=${sWidth}&height=${sHeight}`
      pending = await getDimensions(pending)
    }

    if (pending === undefined) continue

    if (pending.naturalWidth >= sWidth &&
        pending.naturalHeight >= sHeight) {
      data = pending
      break
    }
  }

  if (data !== undefined) return data

  const url = collectionUrl(category)
  const response = await xhr(url)

  if (response === undefined) return

  storeCollection(response.records, response.totalResults, category)

  return getData(category)
}

const storeCollection = (collection, count, category) => {
  for (let art, i = 0, r = collection || [], l = r.length; i < l; ++i) {
    art = r[i]

    const {images, colors} = art

    if (images === null || images === undefined) continue

    const [image] = images

    if (image === null || image === undefined) continue
    if (colors === null || colors === undefined) continue

    const {height, width, baseimageurl} = image

    // todo make procedural
    if (colors.every(d => hueRegex.test(d.hue)) === true) continue

    artworks[category].push({
      source: 'Harvard Art Museums',
      href: art.url,
      img: baseimageurl,
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
