import { get } from 'svelte/store'
import store from './store'
import { ENDPOINTS } from './constants'
import type { ArtObject } from './types'

const randomArtwork = async (): Promise<ArtObject | undefined> => {
	const artworks = await getArtObjects()

	if (artworks.length === 0) {
		return
	}

	return fetchRandomArtwork(artworks)
}

const getArtObjects = async (): Promise<ArtObject[]> => {
	const artObjects = get(store.wikipedia)

	if (artObjects.length > 0) {

		return artObjects

	} else {

		try {

			const json = await (globalThis as any).fetchJSON(ENDPOINTS.wikipedia)
			const artObjects = 'window' in globalThis
				? parseBrowser(json.parse.text['*'])
				: parseNode(json.parse.text['*'])

			store.wikipedia.set(artObjects)

			return artObjects

		} catch {

			return []

		}
	}
}

const parseBrowser = (str: string): ArtObject[] => {
	const artworks: ArtObject[] = []
	const dom = new DOMParser().parseFromString(str, 'text/html')

	for (const el of dom.querySelectorAll('.gallerybox')) {
		const imgEl = el.querySelector('img')
		const titleEl = el.querySelector('.gallerytext b')
		const titleLinkEl = el.querySelector('.gallerytext b a') as HTMLAnchorElement | undefined
		const artistEl = [...el.querySelectorAll('.gallerytext a')].pop() as HTMLAnchorElement | undefined
		const arr = imgEl?.src?.split('/')?.slice(0, -1)
		const src = arr?.join('/')?.replace('/thumb/', '/')
		const title = titleEl?.textContent?.trim()
		const artist = artistEl?.textContent?.trim()
		const artistLink = artistEl?.href
		const titleLink = titleLinkEl?.href

		if (src === undefined) continue

		artworks.push({
			src: `https://upload.wikimedia.org${src.split('//upload.wikimedia.org').pop()}`,
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

const parseNode = (str: string) => {
	const { $ } = globalThis as any
	const artworks: ArtObject[] = []

	$('.gallerybox', str).each((_i: number, el: any) => {
		const imgEl = $('img', el)
		const titleEl: any = $('.gallerytext b', el)
		const titleLinkEl: any = $('.gallerytext b a', el)
		const artistEl = $('.gallerytext a', el)?.last()
		const arr = imgEl.attr('src')?.split('/')?.slice(0, -1)
		const src = arr?.join('/')?.replace('/thumb/', '/')
		const title = titleEl?.text()?.trim()
		const artist = artistEl?.text()?.trim()
		const artistLink = artistEl?.attr('href')
		const titleLink = titleLinkEl?.attr('href')

		if (src === undefined) return

		artworks.push({
			src: `https://upload.wikimedia.org${src.split('//upload.wikimedia.org').pop()}`,
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

	store.wikipedia.set(artObjects)

	return artObject
}

export const wikipedia = {
	randomArtwork
}
