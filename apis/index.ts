import { get } from 'svelte/store'
import store from './store'
import { wikipedia } from './wikipedia'
import { rijks } from './rijks'
import { met } from './met'
import { blacklist } from './blacklist'

import { API_KEYS } from './constants'
import type { ArtObject } from './types'

const apiMap = new Map<string, typeof wikipedia | typeof rijks | typeof met>()
apiMap.set('rijks', rijks)
apiMap.set('wikipedia', wikipedia)
apiMap.set('met', met)

const getArtwork = async (forceNext = false): Promise<ArtObject> => {
	let current = get<ArtObject | undefined>(store.current)
	let next = get<ArtObject | undefined>(store.next)

	if (current === undefined || forceNext) {
		if (next === undefined) {
			current = await getRandom()
		} else {
			current = next
			next = undefined
		}
	}

	store.current.set(current)

	if (next === undefined) {
		next = await getRandom()

		store.next.set(next)
	}

	return current
}

const disable = (apiName: string): void => {
	API_KEYS.splice(API_KEYS.indexOf(apiName), 1)
}

const getRandom = async (): Promise<ArtObject> => {
	const key = API_KEYS[Math.floor(Math.random() * API_KEYS.length)]
	const artwork = await apiMap.get(key)?.randomArtwork()

	if (artwork === undefined) {
		return getRandom()
	}

	if (blacklist.includes(decodeURI(artwork.src)) === true) {
		return getRandom()
	}

	return artwork
}

export const apis = {
	store,
	getArtwork,
	disable
}
