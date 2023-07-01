import type { ArtObject } from '../../apis/types'
import localforage from 'localforage'
import { apis } from '../../apis'
import * as store from '../../apis/store'
import {
	currentStore,
	nextStore,
	currentImageStore,
	nextImageStore,
	wikipediaStore,
	rijksStore,
	rijksPageStore,
	metStore
} from '../../apis/store'

const init = async (): Promise<void> => {
	const promises = new Set()

	promises.add(localforage.getItem('current'))
	promises.add(localforage.getItem('next'))
	promises.add(localforage.getItem('currentImage'))
	promises.add(localforage.getItem('nextImage'))

	const [
		current,
		next,
		currentImage,
		nextImage,
	] = await Promise.all(promises)

	if (current) currentStore.set(current as ArtObject)
	if (next) nextStore.set(next as ArtObject)
	if (currentImage) currentImageStore.set(currentImage)
	if (nextImage) nextImageStore.set(nextImage)

	promises.clear()

	promises.add(localforage.getItem('wikipedia'))
	promises.add(localforage.getItem('rijks'))
	promises.add(localforage.getItem('rijksPage'))
	promises.add(localforage.getItem('met'))

	const [
		wikipedia,
		rijks,
		rijksPage,
		met,
	] = await Promise.all(promises)

	if (wikipedia) wikipediaStore.set(wikipedia as ArtObject[])
	if (rijks) rijksStore.set(rijks as ArtObject[])
	if (rijksPage) rijksPageStore.set(rijksPage as number)
	if (met) metStore.set(met as ArtObject[])

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe(value => {
			localforage.setItem(key, value)
		})
	}

	currentStore.subscribe(async (artObject) => {
		if (artObject === undefined) {
			return
		}

		const response = await window.fetch(artObject.src)
		const blob = await response.blob()
		currentImageStore.set(blob)
	})

	apis.disable('met')
	apis.getArtwork(false)
}

export const storage = {
	init,
}
