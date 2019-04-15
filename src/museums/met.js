import {requestJSON, shuffleArray} from '../util'
import {generateId, ArtObject} from './util'
import {extname} from 'path'

let artObjectIds = []

const url = 'https://collectionapi.metmuseum.org/public/collection/v1'

const classifications = [
  'Paintings',
  'Prints',
  'Drawings',
  'Books'
]

const mediums = [
  'Tempura on paper'
]

export function getMet (cb) {
  if (artObjectIds.length === 0) {
    return getArtObjectIds(cb)
  }

  requestJSON(`${url}/objects/${artObjectIds.pop()}`, function (err, response) {
    if (err) return cb(err)

    const isClassification = classifications.indexOf(response.classification) == -1

    if (!response.primaryImage) return getMet(cb)
    if (!response.isPublicDomain) return getMet(cb)
    if (isClassification) return getMet(cb)

    const object = ArtObject()
    object.source = 'The Metropolitan Museum of Art'
    object.href = response.objectURL
    object.title = response.title
    object.author = response.artistDisplayName
    object.src = response.primaryImage
    object.filename = `Met_${generateId()}${extname(response.primaryImage)}`

    return cb(undefined, object)
  })
}

function getArtObjectIds (cb) {
  requestJSON(`${url}/search?q=Painting`, function (err, response) {
    if (err) return cb(err)

    artObjectIds = response.objectIDs
    shuffleArray(artObjectIds)
    getMet(cb)
  })
}
