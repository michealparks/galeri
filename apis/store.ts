import type { GlobalSubscriber, Subscriber } from './types'

const data = new Map<string, any>()
const subscribers = new Map<string, Set<Subscriber>>()
const globalSubscribers = new Set<GlobalSubscriber>()

const set = (key: string, value: any) => {
	data.set(key, value)

	for (const fn of subscribers.get(key) || new Set()) {
		fn(value)
	}

	for (const fn of globalSubscribers) {
		fn(key, value)
	}
}

const get = (key: string) => {
	return data.get(key)
}

const subscribe = (key: string, fn: Subscriber) => {
	if (subscribers.has(key) === false) {
		subscribers.set(key, new Set())
	}

	subscribers.get(key)?.add(fn)
}

const subscribeAll = (fn: GlobalSubscriber) => {
	globalSubscribers.add(fn)
}

export const store = {
	data,
	get,
	set,
	subscribe,
	subscribeAll
}

