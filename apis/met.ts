import { fetchArrayBuffer } from '../utils/fetch'
import { store } from './store'

import type { Artwork } from './types'

const ENDPOINT = 'https://www.metmuseum.org/mothra/collectionlisting/search?artist=&department=&era=&geolocation=&material=Oil+paint%7CPaintings&offset=0&pageSize=0&perPage=80&q=&searchField=All&showOnly=withImage%7CopenAccess&sortBy=Relevance&sortOrder=asc'
const ENDPOINT_COLLECTION = encodeURI('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11|21')
const ENDPOINT_OBJECT = encodeURI('https://collectionapi.metmuseum.org/public/collection/v1/objects')

const fetchJSON = async (input: string, opts: any) => {
  const util = require('util')
  const exec = util.promisify(require('child_process').exec);

  const { stdout, stderr } = await exec(`curl "${input}"`)
  const json = JSON.parse(stdout)

  return json
}

const randomArtwork = async (): Promise<Artwork | undefined> => {
  const artObjects = await getArtworks()

  if (artObjects.length === 0) {
		return
	}

  return removeRandomArtwork(artObjects)
}

const getArtworks = async (): Promise<Artwork[]> => {
  const artworks = store.get('met')

  if (artworks.length > 0) {
    return artworks
  } else {
    let json: any

    try {
      json = await fetchJSON(ENDPOINT_COLLECTION, {
        // @ts-ignore
        insecureHTTPParser: true
      })
    } catch (err) {
      console.error(err)
      return []
    }

    const artworks = json.objectIDs

    store.set('met', artworks)

    return artworks
  }
}

const removeRandomArtwork = async (artworks: Artwork[]): Promise<Artwork | undefined> => {
  const randomIndex = Math.floor(Math.random() * artworks.length)
  const [id] = (artworks.splice(randomIndex, 1) || [])

  let object: any

  try {
    object = await fetchJSON(`${ENDPOINT_OBJECT}/${id}`, {
      // @ts-ignore
      insecureHTTPParser: true
    })
  } catch (err) {
    console.error(err)
    return
  }

  const {
    primaryImage = '',
    title,
    artistDisplayName,
    objectURL
  } = (object || {})

  if (primaryImage === '' || primaryImage === undefined) {
    return
  }

  const artwork: Artwork = {
    src: primaryImage,
    title: title,
    author: artistDisplayName,
    provider: 'The Metropolitan Museum of Art',
    titleLink: objectURL,
    providerLink: 'https://www.metmuseum.org',
    timestamp: Date.now(),
    buffer: await fetchArrayBuffer(primaryImage)
  }

  store.set('met', artworks)

  return artwork
}

export const met = {
  randomArtwork
}
