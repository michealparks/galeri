const json = (res: Response) => {
	return res.json()
}

export const fetchJSON = (input: RequestInfo, init?: RequestInit): unknown => {
	return fetch(input, init).then(json)
}
