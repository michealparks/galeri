import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { ArtObject } from './types'

export const rijksPage = writable<number>(1)
export const rijks = writable<ArtObject[]>([])
export const met = writable<ArtObject[]>([])
export const wikipedia = writable<ArtObject[]>([])
export const current = writable<ArtObject>()
export const next = writable<ArtObject>()
export const currentImage = writable()
export const nextImage = writable()

const store: Record<string, Writable<any>> = {
	rijks,
	rijksPage,
	met,
	wikipedia,
	current,
	next,
	currentImage,
	nextImage
}

export default store
