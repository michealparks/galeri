export interface ArtObject {
	id: string
	src: string
	title: string | undefined
	titleLink: string | undefined
	artist: string | undefined
	artistLink: string | undefined
	provider: string
	providerLink: string
}

export type Subscriber = {
	(value: unknown): void
}

export type GlobalSubscriber = {
	(key: string, value: unknown): void
}
