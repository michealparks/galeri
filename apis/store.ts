import type { Subscriber } from "./types"

const data = new Map<string, any>()
const listeners = new Map<string, Set<Subscriber>>()

const set = (key: string, value: any) => {
	data.set(key, value)

	for (const fn of listeners.get(key) || new Set()) {
		fn(value)
	}
}

const get = (key: string) => {
	return data.get(key)
}

const subscribe = (key: string, fn: Subscriber) => {
	if (listeners.has(key) === false) {
		listeners.set(key, new Set())
	}

	listeners.get(key)?.add(fn)
}

export const store = {
	get,
	set,
	subscribe
}
