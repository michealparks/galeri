import { store } from './store'
import { ENDPOINTS } from './constants'
import type { ArtObject } from './types'

const randomArtwork = async (): Promise<ArtObject | undefined> => {
	const artObjects = await getArtworks()

	if (artObjects.length === 0) {
		return
	}

	return removeRandomArtwork(artObjects)
}

const getArtworks = async (): Promise<ArtObject[]> => {
	const artworks = store.get('met')

	if (artworks.length > 0) {
		return artworks
	} else {
		let json: any

		try {
			json = await (globalThis as any).fetchJSON(ENDPOINTS.metCollection)
		} catch (err) {
			console.error(err)
			return []
		}

		const artworks = json.objectIDs

		store.set('met', artworks)

		return artworks
	}
}

const removeRandomArtwork = async (artworks: ArtObject[]): Promise<ArtObject | undefined> => {
	const randomIndex = Math.floor(Math.random() * artworks.length)
	const [id] = (artworks.splice(randomIndex, 1) || [])

	let object: any

	try {
		object = await (globalThis as any).fetchJSON(`${ENDPOINTS.metObject}/${id}`)
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

	const artwork: ArtObject = {
		src: primaryImage,
		title: title,
		artist: artistDisplayName,
		artistLink: '',
		provider: 'The Metropolitan Museum of Art',
		titleLink: objectURL,
		providerLink: 'https://www.metmuseum.org'
	}

	store.set('met', artworks)

	return artwork
}

export const met = {
	randomArtwork
}