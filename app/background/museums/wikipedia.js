import getDimensions from '../util/img-size'
import shuffle from '../util/shuffle'
import xhr from '../util/xhr'
import parseHTML from '../util/html-parser'
import {screenWidth} from '../util/screen'
import {restoreData} from './helpers'

const pixelRegex = /[0-9]{3,4}px/
const parenRegex = / *\([^)]*\) */g
const artworks = {}

restoreData(['wikipedia:Paintings'], artworks)

export const wikipediaConfig = (category) => ({
  artworks: artworks[category]
})

export const wikipediaArt = async (category) => {
  if (__dev__) console.log('wikipediaArt()')

  const data = await getData(category)
  const size = `${Math.floor(screenWidth() + 500)}px`

  data.img = data.img.replace(pixelRegex, size)

  const art = await getDimensions(data)

  return art
}

const getData = async (category) => {
  const data = artworks[category].pop()

  if (data !== undefined) return data

  const url = collectionUrl(category)
  const response = await xhr(url)

  if (response === undefined) return

  storeCollection(response.parse.text['*'], category)
  return getData(category)
}

const storeCollection = (text, category) => {
  const html = parseHTML(text)
  const gallerytext = html.getElementsByClassName('gallerytext')

  for (let i = 0, list = html.querySelectorAll('.gallery img'), l = list.length; i < l; ++i) {
    const a = gallerytext[i].querySelectorAll('a')

    artworks[category].push({
      source: 'Wikipedia',
      title: a[0].getAttribute('title').replace(parenRegex, ''),
      text: a[1] ? a[1].getAttribute('title').replace(parenRegex, '') : '',
      href: `https://wikipedia.org${a[0].getAttribute('href')}`,
      img: `https:${list[i].getAttribute('src')}`
    })
  }

  shuffle(artworks[category])
}

const collectionUrl = (category) => (
  'https://en.wikipedia.org/w/api.php' +
  '?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/' +
  category + '&format=json&origin=*'
)
