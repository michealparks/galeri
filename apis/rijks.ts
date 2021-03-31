import { fetchArrayBuffer, fetchJSON } from '../utils/fetch'
import { store } from './store'
import type { ArtObject, Artwork } from './types'

const url = 'https://www.rijksmuseum.nl/api/en/collection?format=json&ps=30&imgonly=True&type=painting&key=1KfM6MpD'

const randomArtwork = async (): Promise<Artwork | undefined> => {
  const artworks = await getArtworks()

  if (artworks.length === 0) {
		return
	}

  return removeRandomArtwork(artworks)
}

const getArtworks = async (): Promise<ArtObject[]> => {
	const artworks = store.get('rijks')

  if (artworks.length > 0) {
    return artworks
  } else {
		const page = store.get('rijksPage') || 1

    let json
	
    try {
      json = await fetchJSON(`${url}&p=${page}`)
    } catch {
      return []
    }

    const artworks: ArtObject[] = []

    for (const artObject of json.artObjects) {
      if (!artObject.webImage) continue

      artworks.push({
        src: artObject.webImage.url,
        title: (artObject.title || '').trim(),
        author: (artObject.principalOrFirstMaker || '').trim(),
        provider: 'Rijksmuseum',
        titleLink: artObject.links.web,
        providerLink: 'https://www.rijksmuseum.nl/en'
      })
    }

    store.set('rijks', artworks)
		store.set('rijksPage', page + 1)

    return artworks
  }
}

const removeRandomArtwork = async (artObjects: ArtObject[]): Promise<Artwork | undefined> => {
  const randomIndex = Math.floor(Math.random() * artObjects.length)
  const [object] = (artObjects.splice(randomIndex, 1) || [])

  store.set('rijks', artObjects)

  const artwork: Artwork = {
    ...object,
    timestamp: Date.now(),
    buffer: await fetchArrayBuffer(object.src)
  }

  return artwork
}

export const rijks = {
  randomArtwork
}
