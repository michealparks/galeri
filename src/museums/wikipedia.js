import {requestJSON, shuffleArray} from '../util.js'

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

    let textStart = 0
    let objectStart, hrefStart, hrefEnd, titleStart, titleEnd, authorStart, authorEnd, imgStart, imgEnd
    let href, title, author, arr, src, filename

    do {
      objectStart = text.indexOf('gallerytext', textStart)
      hrefStart = text.indexOf('<a href=\"', objectStart) + 9
      hrefEnd = text.indexOf('\"', hrefStart)
      titleStart = text.indexOf('title=\"', hrefStart) + 7
      titleEnd = text.indexOf('\"', titleStart)
      authorStart = text.indexOf('title=\"', titleEnd) + 7
      authorEnd = text.indexOf('\"', authorStart)
      imgStart = text.indexOf('src=\"', authorEnd) + 7
      imgEnd = text.indexOf('\"', imgStart)

      href = `https://en.wikipedia.org${text.substring(hrefStart, hrefEnd)}`
      title = text.substring(titleStart, titleEnd)
      author = text.substring(authorStart, authorEnd)
      arr = text.substring(imgStart, imgEnd).split('/')
      src = `https://${arr[0]}/${arr[1]}/${arr[2]}/${arr[4]}/${arr[5]}/${arr[6]}`
      filename = `Wikipedia_${arr.pop()}`

      if (textStart > imgEnd) break

      textStart = imgEnd

      artObjects.push({source: 'Wikipedia', href, title, author, src, filename})

    } while (textStart < length)

    shuffleArray(artObjects)
    getWikipedia(cb)
  })
}
