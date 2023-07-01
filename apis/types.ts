export type ArtObject = {
	id: string,
	src: string,
	title?: string,
	titleLink?: string,
	artist?: string,
	artistLink?: string,
	provider: string,
	providerLink: string,
}

export type Subscriber = {
	(value: unknown): void
}

export type GlobalSubscriber = {
	(key: string, value: unknown): void
}
