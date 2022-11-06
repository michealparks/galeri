import { nanoid } from 'nanoid'
import { get } from 'svelte/store'
import { wikipedia as wikipediaStore } from './store'
import { ENDPOINTS } from './constants'
import type { ArtObject } from './types'
import type { CheerioAPI } from 'cheerio'

const { fetchJSON } = globalThis

/**
 * http://en.wikipedia.org/w/api.php?format=json&action=query&generator=images&prop=imageinfo&iiprop=url|dimensions|mime&gimlimit=500&pageids=16924509
 * http://en.wikipedia.org/w/api.php?format=json&action=query&generator=images&prop=imageinfo&iiprop=url|dimensions|mime&gimcontinue=16924509|Vincent_van_Gogh_-_Dr_Paul_Gachet_-_Google_Art_Project.jpg
 */
const randomArtwork = async (): Promise<ArtObject | undefined> => {
	const artworks = await getArtObjects()

	if (artworks.length === 0) {
		return
	}

	return fetchRandomArtwork(artworks)
}

const getArtObjects = async (): Promise<ArtObject[]> => {
	const artObjects = get(wikipediaStore)

	if (artObjects.length > 0) {

		return artObjects

	} else {

		try {
			const json = await fetchJSON(ENDPOINTS.wikipedia)
			const artObjects = 'window' in globalThis
				? parseBrowser(json.parse.text['*'])
				: parseNodeJS(json.parse.text['*'])

			wikipediaStore.set(artObjects)

			return artObjects

		} catch {

			return []

		}
	}
}

const parseBrowser = (string: string): ArtObject[] => {
	const artworks: ArtObject[] = []
	const dom = new DOMParser().parseFromString(string, 'text/html')

	for (const element of dom.querySelectorAll('.gallerybox')) {
		const imgElement = element.querySelector('img')
		const titleElement = element.querySelector('.gallerytext b')
		const titleLinkElement = element.querySelector('.gallerytext b a') as HTMLAnchorElement | undefined
		const artistElement = [...element.querySelectorAll('.gallerytext a')].pop() as HTMLAnchorElement | undefined
		const array = imgElement?.src?.split('/')?.slice(0, -1)
		const source = array?.join('/')?.replace('/thumb/', '/')
		const title = titleElement?.textContent?.trim()
		const artist = artistElement?.textContent?.trim()
		const artistLink = artistElement?.href
		const titleLink = titleLinkElement?.href

		if (source === undefined) continue

		artworks.push({
			id: nanoid(),
			src: `https://upload.wikimedia.org${source.split('//upload.wikimedia.org').pop()}`,
			title,
			artist,
			artistLink,
			titleLink: titleLink ? `https://wikipedia.org/wiki${titleLink.split('/wiki').pop()}` : '',
			provider: 'Wikipedia',
			providerLink: 'https://wikipedia.org'
		})
	}

	return artworks
}

const parseNodeJS = (string: string) => {
	const { $ } = globalThis as unknown as { $: CheerioAPI }
	const artworks: ArtObject[] = []

	$('.gallerybox', string).each((_index: number, element) => {
		const imgElement = $('img', element)
		const titleElement = $('.gallerytext b', element)
		const titleLinkElement = $('.gallerytext b a', element)
		const artistElement = $('.gallerytext a', element)?.last()
		const array = imgElement.attr('src')?.split('/')?.slice(0, -1)
		const source = array?.join('/')?.replace('/thumb/', '/')
		const title = titleElement?.text()?.trim()
		const artist = artistElement?.text()?.trim()
		const artistLink = artistElement?.attr('href')
		const titleLink = titleLinkElement?.attr('href')

		if (source === undefined) return

		artworks.push({
			id: nanoid(),
			src: `https://upload.wikimedia.org${source.split('//upload.wikimedia.org').pop()}`,
			title,
			artist,
			artistLink,
			titleLink: titleLink ? `https://wikipedia.org/wiki${titleLink.split('/wiki').pop()}` : '',
			provider: 'Wikipedia',
			providerLink: 'https://wikipedia.org'
		})
	})

	return artworks
}

const fetchRandomArtwork = (artObjects: ArtObject[]): ArtObject | undefined => {
	const randomIndex = Math.floor(Math.random() * artObjects.length)
	const [artObject] = (artObjects.splice(randomIndex, 1) || [])

	wikipediaStore.set(artObjects)

	return artObject
}

export const wikipedia = {
	randomArtwork
}
