import { writable } from 'svelte/store'
import type { ArtObject } from './types'

export const rijksPageStore = writable<number>(1)
export const rijksStore = writable<ArtObject[]>([])
export const metStore = writable<ArtObject[]>([])
export const wikipediaStore = writable<ArtObject[]>([])
export const currentStore = writable<ArtObject>()
export const nextStore = writable<ArtObject>()
export const currentImageStore = writable()
export const nextImageStore = writable()
