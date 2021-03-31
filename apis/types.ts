export type ArtObject = {
	src: string,
	title: string,
	author: string,
	provider: string,
	titleLink: string,
	providerLink: string,
}

export type Artwork = {
	src: string,
	title: string,
	author: string,
	provider: string,
	titleLink: string,
	providerLink: string,
	timestamp: number,
	buffer: ArrayBuffer
}

export type Subscriber = {
	(value: any): void
}
