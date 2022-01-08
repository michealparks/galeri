import type { ArtObject } from './types'

import { get } from 'svelte/store'
import { store, current as currentStore, next as nextStore } from './store'
import { wikipedia } from './wikipedia'
import { rijks } from './rijks'
import { met } from './met'
import { blacklist } from './blacklist'
import { API_KEYS } from './constants'
import { nanoid } from 'nanoid'

type Apis = typeof wikipedia | typeof rijks | typeof met

const apiMap = new Map<string, Apis>()
apiMap.set('rijks', rijks)
apiMap.set('wikipedia', wikipedia)
apiMap.set('met', met)

const getArtwork = async (forceNext = false): Promise<void> => {
	let current = get(currentStore) as ArtObject | undefined
	let next = get(nextStore) as ArtObject | undefined

	if (current === undefined || forceNext) {
		if (next === undefined) {
			current = await getRandom()
		} else {
			current = next
			next = undefined
		}
	}

	currentStore.set(current)

	if (next === undefined) {
		next = await getRandom()

		nextStore.set(next)
	}
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

	if (artwork.id === undefined) {
		artwork.id = nanoid()
	}

	return artwork
}

export const apis = {
	store,
	getArtwork,
	disable
}
