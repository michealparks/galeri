import { fetchArrayBuffer, fetchJSON } from '../utils/fetch'
import { store } from './store'
import type { ArtObject, Artwork } from './types'

const randomArtwork = async (): Promise<Artwork | undefined> => {
  const artworks = await getArtObjects()

  if (artworks.length === 0) {
    return
  }

  return fetchRandomArtwork(artworks)
}

const getArtObjects = async (): Promise<ArtObject[]> => {
  const artObjects = store.get('wikipedia')

  if (artObjects.length > 0) {
    return artObjects
  } else {
    const page = 'Wikipedia:Featured_pictures/Artwork/Paintings'
    const url = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${page}&format=json&origin=*`

    let json

    try {
      json = await fetchJSON(url)
    } catch {
      return []
    }

    const artObjects = parsePage(json.parse.text['*'])

    store.set('wikipedia', artObjects)

    return artObjects
  }
}

const parsePage = (str: string) => {
  // @ts-ignore
  const doc = new globalThis.DOMParser().parseFromString(str, 'text/html')
  const galleryboxes = doc.querySelectorAll('.gallerybox')
  const artworks: ArtObject[] = []

  for (const gallerybox of galleryboxes) {
    const img = gallerybox.querySelector('img') || { src: '' }
    const links = gallerybox.querySelectorAll('.gallerytext a')
    const boldEl = gallerybox.querySelector('.gallerytext b')
    const titleEl = (boldEl?.children[0] ? boldEl.children[0] : boldEl) as HTMLAnchorElement
    const authorEl = (links.length > 1 ? links[1] : links[0]) as HTMLAnchorElement
    const arr = img.src.split('/').slice(0, -1)
    const src = arr.concat(`2000px-${arr[arr.length - 1]}`).join('/')

    const title = (titleEl?.textContent || '').trim()
    const titleLink = titleEl?.href
    const author = (authorEl?.innerText || '').trim()

    artworks.push({
      src: `https://upload.wikimedia.org${src.split('//upload.wikimedia.org').pop()}`,
      title,
      author,
      titleLink: titleLink ? `https://wikipedia.org/wiki${titleLink.split('/wiki').pop()}` : '',
      provider: 'Wikipedia',
      providerLink: 'https://wikipedia.org'
    })
  }

  return artworks
}

const fetchRandomArtwork = async (artObjects: ArtObject[]): Promise<Artwork | undefined> => {
  const randomIndex = Math.floor(Math.random() * artObjects.length)
  const [artObject] = (artObjects.splice(randomIndex, 1) || [])

  const artwork: Artwork = {
    ...artObject,
    timestamp: Date.now(),
    buffer: await fetchArrayBuffer(artObject.src)
  }

  store.set('wikipedia', artObjects)

  return artwork
}

export const wikipedia = {
  randomArtwork
}
