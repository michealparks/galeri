import { wikipedia } from './wikipedia'
import { rijks } from './rijks'
import { met } from './met'
import { blacklist } from './blacklist'
import { store } from './store'
import { API_KEYS } from './constants'
import type { ArtObject } from './types'

const apiMap = new Map()
apiMap.set('rijks', rijks)
apiMap.set('wikipedia', wikipedia)
apiMap.set('met', met)

const get = async (forceNext = false): Promise<ArtObject> => {
	let current = store.get('current') as ArtObject | undefined
	let next = store.get('next') as ArtObject | undefined

	if (current === undefined || forceNext) {
		if (next === undefined) {
			current = await getArtwork()
		} else {
			current = next
			next = undefined
		}
	}

	store.set('current', current)

	if (next === undefined) {
		next = await getArtwork()

		store.set('next', next)
	}

	return current
}

const disable = (apiName: string) => {
	API_KEYS.splice(API_KEYS.indexOf(apiName), 1)
}

const getRandom = (): Promise<ArtObject | undefined> => {
	const key = API_KEYS[Math.floor(Math.random() * API_KEYS.length)]
	return apiMap.get(key)?.randomArtwork()
}

const getArtwork = async (): Promise<ArtObject> => {
	const artwork = await getRandom()

	if (artwork === undefined) {
		return getArtwork()
	}

	if (blacklist.includes(decodeURI(artwork.src))) {
		return getArtwork()
	}

	return artwork
}

export const apis = {
	get,
	disable
}
