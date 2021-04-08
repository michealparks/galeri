const json = (res: Response) => {
	return res.json()
}

(globalThis as any).fetchJSON = (input: RequestInfo, init?: RequestInit) => {
	return fetch(input, init).then(json)
}

export {}
