import {requestJSON, shuffleArray} from '../util'
import {generateId, ArtObject} from './util'
import {extname} from 'path'

const artObjects = []
const url = 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=Wikipedia:Featured_pictures/Artwork/Paintings&format=json&origin=*'

export function getWikipedia (cb) {
  if (artObjects.length > 0) return cb(undefined, artObjects.pop())

  return requestData(cb)
}

function requestData (cb) {
  requestJSON(url, function (err, response) {
    if (err) return cb(err)

    const text = response.parse.text['*']
    const length = text.length

    let textStart = text.indexOf('class=\"gallery') + 'class=\"gallery'.length
    let objectStart, hrefStart, hrefEnd, titleStart, titleEnd, authorStart, authorEnd, imgStart, imgEnd
    let href, title, author, srcarr, src, filename, ext

    do {
      objectStart = text.indexOf('gallerybox', textStart)
      imgStart = text.indexOf('src=\"\/\/', objectStart) + 'src=\"\/\/'.length
      imgEnd = text.indexOf('\"', imgStart)
      hrefStart = text.indexOf('<a href=\"', imgEnd) + '<a href=\"'.length
      hrefEnd = text.indexOf('\"', hrefStart)
      titleStart = text.indexOf('title=\"', hrefStart) + 'title=\"'.length
      titleEnd = text.indexOf('\"', titleStart)
      authorStart = text.indexOf('title=\"', titleEnd) + 'title=\"'.length
      authorEnd = text.indexOf('\"', authorStart)

      if (textStart > authorEnd) break

      const object = ArtObject()
      object.source = 'Wikipedia'
      object.href = `https://en.wikipedia.org${text.substring(hrefStart, hrefEnd)}`
      object.title = text.substring(titleStart, titleEnd)
      object.author = text.substring(authorStart, authorEnd)

      src = text.substring(imgStart, imgEnd)
      ext = extname(src)
      srcarr = src.split('/')
      
      object.src = `https://${srcarr[0]}/${srcarr[1]}/${srcarr[2]}/${srcarr[4]}/${srcarr[5]}/${srcarr[6]}`
      object.filename = `Wikipedia_${generateId()}${ext}`

      textStart = authorEnd

      artObjects.push(object)

    } while (textStart < length)

    shuffleArray(artObjects)
    getWikipedia(cb)
  })
}
