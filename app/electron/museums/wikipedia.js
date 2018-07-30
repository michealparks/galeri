import {Parser} from 'htmlparser2'
import {restoreData} from './helpers'
import {getScreenSize, shuffle, fetchJSON} from '../../util'

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

  if (data === undefined) return

  const size = `${getScreenSize().width * 2 | 0}px`

  data.img = data.img.replace(pixelRegex, size)

  return data
}

const getData = async (category) => {
  const data = artworks[category].pop()

  if (data !== undefined) return data

  const url = collectionUrl(category)
  const response = await fetchJSON(url)

  if (response === undefined) return

  await storeCollection(response.parse.text['*'], category)
}

const artObj = () => (
  {source: 'Wikipedia', title: '', text: '', href: '', img: '', ext: '.png'}
)

const storeCollection = (text, category) => new Promise(resolve => {
  let isInInfo = false
  let didParseFirstA = false
  let currentArt

  const parser = new Parser({
    onopentag (name, attribs) {
      if (isInInfo && name === 'a') {
        if (didParseFirstA === false) {
          currentArt.title = attribs.title
          currentArt.href = 'https://wikipedia.org' + attribs.href
          didParseFirstA = true
        } else if (attribs.class === undefined) {
          currentArt.text = attribs.title
        }
      } else if (isInInfo && name === 'img') {
        currentArt.img = `https:${attribs.src}`
        isInInfo = false
        didParseFirstA = false
        artworks[category].push(currentArt)
      } else if (attribs.class === 'gallerytext') {
        isInInfo = true
        currentArt = artObj()
      }
    },
    onerror (err) {
      console.error(err)
      resolve()
    },
    onend () {
      resolve()
    }
  }, {decodeEntities: true})

  parser.write(text)
  parser.end()

  shuffle(artworks[category])
})

const collectionUrl = (category) => (
  'https://en.wikipedia.org/w/api.php' +
  '?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/' +
  category + '&format=json&origin=*'
)
