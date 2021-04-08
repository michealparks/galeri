import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { ArtObject } from './types'

const rijksPage = writable<number>(1)
const rijks = writable<ArtObject[]>([])
const met = writable<ArtObject[]>([])
const wikipedia = writable<ArtObject[]>([])
const current = writable<ArtObject | undefined>(undefined)
const next = writable<ArtObject | undefined>(undefined)
const currentImage = writable(undefined)
const nextImage = writable(undefined)

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
