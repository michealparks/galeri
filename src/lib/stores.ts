
import { writable } from 'svelte/store'
import type { ArtObject } from '../../apis/types'

const artObject: ArtObject = {
	src: '',
	title: '',
	artist: '',
	artistLink: '',
	provider: '',
	titleLink: '',
	providerLink: '',
}

export const current = writable(artObject)
export const next = writable(artObject)
export const currentImage = writable(undefined)
export const nextImage = writable(undefined)
