import {walters as key} from './keys'
import getDimensions from '../util/img-size'
import shuffle from '../util/shuffle'
import xhr from '../util/xhr'
import {restoreData} from './helpers'

const artworks = {}
const page = {}

restoreData([
  'walters_painting:classification=painting'
], artworks, undefined, page, 20)

export const waltersConfig = (category) => ({
  artworks: artworks[category],
  page: page[category]
})

export const waltersArt = (category) => {
  if (__dev__) console.log('waltersArt()')

  return getData(category)
}

const getData = async (category) => {
  while (artworks[category].length > 0) {
    const pending = artworks[category].pop()
    const art = await getDimensions(pending)

    if (art !== undefined) return art
  }

  const url = collectionUrl(category)
  const response = await xhr(url)

  if (response === undefined) return

  storeCollection(response.Items, response.NextPage, category)
}

const storeCollection = (collection, nextPage, category) => {
  for (let art, i = 0, r = collection || [], l = r.length; i < l; ++i) {
    art = r[i]

    const {PrimaryImage} = art
    if (PrimaryImage === null || PrimaryImage === undefined) continue

    const {Raw} = PrimaryImage
    if (Raw === null || Raw === undefined) continue

    artworks[category].push({
      source: 'The Walters Art Museum',
      href: art.ResourceURL,
      img: `${Raw}?quality=100&format=jpg`,
      naturalWidth: 0,
      naturalHeight: 0,
      title: art.Title,
      text: art.Creator
    })
  }

  shuffle(artworks[category])

  if (nextPage) {
    page[category] += 1
  } else {
    page[category] = 0
  }
}

const collectionUrl = (category) => (
  'http://api.thewalters.org/v1/objects' +
  '?apikey=' + key +
  '&page=' + page[category] +
  '&' + category
)
