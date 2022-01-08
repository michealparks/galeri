const json = (res: Response) => {
	return res.json()
}

globalThis.fetchJSON = (input: RequestInfo, init?: RequestInit) => {
	return fetch(input, init).then(json)
}

export {}
