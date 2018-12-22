import {requestJSON, shuffleArray} from '../util.js'

const artObjects = []

export function getRijks (cb) {
  if (artObjects.length > 0) {
    return requestDetails(artObjects.pop(), cb)
  }

  return requestData(cb)
}

function requestDetails (artObject, cb) {
  const url = detailsUrl(artObject.id)

  return requestJSON(url, function (err, response) {
    if (err) return cb(err)

    const url = response.artObject.webImage.url

    artObject.src = url
    artObject.filename = `Wikipedia_${url.split('/').pop()}`

    return cb(undefined, artObject)
  })
}

function requestData (cb) {
  const url = collectionUrl(Math.random() * 10 | 0)
  
  return requestJSON(url, function (err, response) {
    if (err) return cb(err)

    const arr = response.artObjects || [], count = response.count

    for (let art, links, i = 0, l = arr.length; i < l; i++) {
      art = arr[i]
      links = art.links

      if (links === null || links === undefined) return

      artObjects.push({
        source: 'Rijks',
        href: links.web,
        id: art.objectNumber,
        title: art.title,
        author: art.principalOrFirstMaker,
        src: '',
        filename: ''
      })
    }

    shuffleArray(artObjects)
    getRijks(cb)
  })
}

function collectionUrl (page) {
  return `https://www.rijksmuseum.nl/api/en/collection?format=json&ps=30&p=${page}&imgonly=True&type=painting&key=1KfM6MpD`
}

function detailsUrl (id) {
  return `https://www.rijksmuseum.nl/api/en/collection/${id}?format=json&key=1KfM6MpD`
}
