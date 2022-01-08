import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { ArtObject } from './types'

export const rijksPage = writable(1)
export const rijks = writable<ArtObject[]>([])
export const met = writable<ArtObject[]>([])
export const wikipedia = writable<ArtObject[]>([])
export const current = writable<ArtObject | undefined>()
export const next = writable<ArtObject | undefined>()
export const currentImage = writable<Blob>()
export const nextImage = writable<Blob>()

export const store: Record<string, Writable<unknown>> = {
	rijks,
	rijksPage,
	met,
	wikipedia,
	current,
	next,
	currentImage,
	nextImage
}
