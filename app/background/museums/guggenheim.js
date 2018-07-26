import {restoreData, getNextPages, getArtInScreenSize} from './helpers'
import shuffle from '../util/shuffle'
import xhr from '../util/xhr'

const perPage = 27
const goodMediums = /goache|ink|monoprint|watercolor|graphite|metallic ink/
const badMediums = /ink on paper|graphite and collage on paper/
const nextPages = {}
const page = {}
const artworks = {}

restoreData([
  'guggenheim_painting:painting',
  'guggenheim_paper:work-on-paper'
], artworks, nextPages, page, 20)

export const guggenheimConfig = (category) => ({
  artworks: artworks[category],
  nextPages: nextPages[category],
  page: page[category]
})

export const guggenheimArt = (category) => {
  if (__dev__) console.log('guggenheimArt()')

  return getData(category)
}

const getData = async (category) => {
  const data = getArtInScreenSize(artworks[category])

  if (data !== undefined) return data

  const url = getCollectionUrl(category)
  const response = await xhr(url)

  if (response === undefined) return

  storeCollection(response, category)
}

const storeCollection = (collection, category) => {
  for (let art, i = 0, r = collection || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (!goodMediums.test(art.medium.toLowerCase()) ||
         badMediums.test(art.medium.toLowerCase())) continue

    artworks[category].push({
      source: 'Solomon R. Guggenheim Museum',
      href: art.link,
      img: art.featured_image.src,
      naturalWidth: art.featured_image.width,
      naturalHeight: art.featured_image.height,
      title: art.sort_title,
      text: art.artist[0].name,
      isFavorited: false
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const totalPages = 22 /* hardcoded :( */
    nextPages[category] = getNextPages(page[category], totalPages, 1)
  }

  page[category] = nextPages[category].pop()
}

const getCollectionUrl = (category) => (
  'https://www.guggenheim.org/wp-json/wp/v2/artwork' +
  '?filter[artwork_type]=' + category +
  '&per_page=' + perPage +
  '&page=' + page[category]
)
