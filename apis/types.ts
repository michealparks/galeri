export type ArtObject = {
	id: string,
	src: string,
	title: string | undefined,
	titleLink: string | undefined,
	artist: string | undefined,
	artistLink: string | undefined,
	provider: string,
	providerLink: string,
}

export type Subscriber = {
	(value: any): void
}

export type GlobalSubscriber = {
	(key: string, value: any): void
}
