import { get } from 'svelte/store'
import store from './store'
import { ENDPOINTS } from './constants'
import type { ArtObject } from './types'

const randomArtwork = async (): Promise<ArtObject | undefined> => {
	const artworks = await getArtworks()

	if (artworks.length === 0) {
		return
	}

	return removeRandomArtwork(artworks)
}

const getArtworks = async (): Promise<ArtObject[]> => {
	const artworks = get(store.rijks)

	if (artworks.length > 0) {
		return artworks
	} else {
		const page = get(store.rijksPage)

		let json
	
		try {
			json = await (globalThis as any).fetchJSON(`${ENDPOINTS.rijks}&p=${page}`)
		} catch {
			return []
		}

		const artworks: ArtObject[] = []

		for (const artObject of json.artObjects) {
			if (!artObject.webImage || !artObject.webImage.url) {
				continue
			}

			artworks.push({
				src: artObject.webImage.url,
				title: artObject.title
					? artObject.title.trim()
					: undefined,
				artist: artObject.principalOrFirstMaker
					? artObject.principalOrFirstMaker.trim()
					: undefined,
				artistLink: undefined,
				provider: 'Rijksmuseum',
				titleLink: artObject.links.web,
				providerLink: 'https://www.rijksmuseum.nl/en'
			})
		}

		store.rijks.set(artworks)
		store.rijksPage.set(page + 1)

		return artworks
	}
}

const removeRandomArtwork = (artObjects: ArtObject[]): ArtObject | undefined => {
	const randomIndex = Math.floor(Math.random() * artObjects.length)
	const [artObject] = (artObjects.splice(randomIndex, 1) || [])

	store.rijks.set(artObjects)

	return artObject
}

export const rijks = {
	randomArtwork
}
