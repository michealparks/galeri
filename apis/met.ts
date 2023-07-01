import { nanoid } from 'nanoid'
import { get } from 'svelte/store'
import { metStore } from './store'
import { ENDPOINTS } from './constants'
import { fetchJSON } from './fetch'
import type { ArtObject } from './types'

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

			const json = await fetchJSON(ENDPOINTS.metCollection) as {
				objectIDs: string[]
			}

			const artworks = json.objectIDs
			metStore.set(artworks)
			return artworks

		} catch (error) {
			console.error(error)
			return []
		}
	}
}

const removeRandomArtwork = async (artworks: ArtObject[]): Promise<ArtObject | undefined> => {
	const randomIndex = Math.floor(Math.random() * artworks.length)
	const [id] = (artworks.splice(randomIndex, 1) || [])

	interface MetArtObject {
		primaryImage: string
		title: string
		artistDisplayName: string
		objectURL: string
	}

	let object: MetArtObject

	try {
		object = await fetchJSON(`${ENDPOINTS.metObject}/${id}`) as MetArtObject
	} catch (error) {
		console.error(error)
		return
	}

	const {
		primaryImage = '',
		title,
		artistDisplayName,
		objectURL,
	} = (object || {})

	if (primaryImage === '' || primaryImage === undefined) {
		return
	}

	const artwork: ArtObject = {
		id: nanoid(),
		src: primaryImage,
		title,
		artist: artistDisplayName,
		artistLink: '',
		provider: 'The Metropolitan Museum of Art',
		titleLink: objectURL,
		providerLink: 'https://www.metmuseum.org',
	}

	metStore.set(artworks)

	return artwork
}

export const met = {
	randomArtwork,
}
