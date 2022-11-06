import { nanoid } from 'nanoid'
import { get } from 'svelte/store'
import { met as metStore } from './store'
import { ENDPOINTS } from './constants'
import type { ArtObject } from './types'

const { fetchJSON } = globalThis

const randomArtwork = async (): Promise<ArtObject | undefined> => {
	const artObjects = await getArtworks()

	if (artObjects.length === 0) {
		return
	}

	return removeRandomArtwork(artObjects)
}

const getArtworks = async (): Promise<ArtObject[]> => {
	const artworks = get(metStore)

	if (artworks.length > 0) {

		return artworks

	} else {

		try {

			const json = await fetchJSON(ENDPOINTS.metCollection)
			const artworks = json.objectIDs
			metStore.set(artworks)
			return artworks

		} catch (error) {
			console.error(error)
			return []
		}
	}
}

interface MetResponse {
	primaryImage?: ''
	title: string
	artistDisplayName: string
	objectURL: string
}

const removeRandomArtwork = async (artworks: ArtObject[]): Promise<ArtObject | undefined> => {
	const randomIndex = Math.floor(Math.random() * artworks.length)
	const [id] = (artworks.splice(randomIndex, 1) || [])

	let object: MetResponse

	try {
		object = await fetchJSON(`${ENDPOINTS.metObject}/${id}`)
	} catch (error) {
		console.error(error)
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
		id: nanoid(),
		src: primaryImage,
		title: title,
		artist: artistDisplayName,
		artistLink: '',
		provider: 'The Metropolitan Museum of Art',
		titleLink: objectURL,
		providerLink: 'https://www.metmuseum.org'
	}

	metStore.set(artworks)

	return artwork
}

export const met = {
	randomArtwork
}
