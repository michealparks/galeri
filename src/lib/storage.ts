import localforage from 'localforage'
import { current, currentImage, next, nextImage } from './stores'
import { apis } from '../../apis'
import { store as apiStore } from '../../apis/store'

const init = async () => {
	const promises = new Set()

	promises.add(localforage.getItem('current'))
	promises.add(localforage.getItem('next'))
	promises.add(localforage.getItem('currentImage'))
	promises.add(localforage.getItem('nextImage'))

	const resolves1 = await Promise.all(promises)

	apiStore.set('current', resolves1[0] || undefined)
	apiStore.set('next', resolves1[1] || undefined)
	currentImage.set(resolves1[2] || undefined)
	nextImage.set(resolves1[3] || undefined) 

	promises.clear()

	promises.add(localforage.getItem('wikipedia'))
	promises.add(localforage.getItem('rijks'))
	promises.add(localforage.getItem('rijksPage'))
	promises.add(localforage.getItem('met'))

	const resolves2 = await Promise.all(promises)

	apiStore.set('wikipedia', resolves2[0] || [])
	apiStore.set('rijks', resolves2[1] || [])
	apiStore.set('rijksPage', resolves2[2] || 1)
	apiStore.set('met', resolves2[3] || [])

	apiStore.subscribeAll((key, value) => {
		localforage.setItem(key, value)
	})

	apiStore.subscribe('current', async (artObject) => {
		current.set(artObject)

		const response = await window.fetch(artObject.src)
		const blob = await response.blob()
		currentImage.set(blob)
		localforage.setItem('currentImage', blob)
	})

	apis.disable('met')
	apis.get(false)
}

export const storage = {
	init
}
