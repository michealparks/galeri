const json = (response: Response) => {
	return response.json()
}

globalThis.fetchJSON = (input: RequestInfo, init?: RequestInit) => {
	return fetch(input, init).then(json)
}

export {}
