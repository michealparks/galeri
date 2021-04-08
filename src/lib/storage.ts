import localforage from 'localforage'
import { apis } from '../../apis'
import store from '../../apis/store'

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
		nextImage
	] = await Promise.all(promises)

	if (current) store.current.set(current)
	if (next) store.next.set(next)
	if (currentImage) store.currentImage.set(currentImage)
	if (nextImage) store.nextImage.set(nextImage)

	promises.clear()

	promises.add(localforage.getItem('wikipedia'))
	promises.add(localforage.getItem('rijks'))
	promises.add(localforage.getItem('rijksPage'))
	promises.add(localforage.getItem('met'))

	const [
		wikipedia,
		rijks,
		rijksPage,
		met
	] = await Promise.all(promises)

	if (wikipedia) store.wikipedia.set(wikipedia)
	if (rijks) store.rijks.set(rijks)
	if (rijksPage) store.rijksPage.set(rijksPage)
	if (met) store.met.set(met)

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe(value => {
			localforage.setItem(key, value)
		})
	}

	store.current.subscribe(async (artObject) => {
		const response = await window.fetch(artObject.src)
		const blob = await response.blob()

		store.currentImage.set(blob)
	})

	apis.disable('met')
	apis.getArtwork(false)
}

export const storage = {
	init
}
