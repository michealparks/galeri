import path from 'node:path'
import fs from 'node:fs/promises'
import { API_KEYS } from '../apis/constants'
import { store } from '../apis/store'
import { ERROR_EEXIST, ERROR_ENOENT, GALERI_DATA_PATH } from './constants'
import { isErrnoException } from './util'

const init = async (): Promise<void> => {
	try {
		await fs.mkdir(GALERI_DATA_PATH)
	} catch (error) {
		if (isErrnoException(error) && error.code !== ERROR_EEXIST) {
			console.warn('storage.init():', error)
		}
	}

	for (const api of API_KEYS) {
		try {
			const filepath = path.resolve(GALERI_DATA_PATH, `${api}.json`)
			const file = await fs.readFile(filepath, 'utf-8')
			store[api].set(JSON.parse(file))
		} catch (error) {
			if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
				console.warn('storage.init():', error)
			}
		}
	}

	try {
		const filepath = path.resolve(GALERI_DATA_PATH, `rijksPage.json`)
		const file = await fs.readFile(filepath, 'utf-8')
		store.rijksPage.set(JSON.parse(file))
	} catch (error) {
		if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
			console.warn('storage.init():', error)
		}
	}

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe((value: unknown) => {
			// @TODO this is sloppy
			if (value === undefined) {
				return
			}

			const filepath = path.resolve(GALERI_DATA_PATH, `${key}.json`)

			try {
				fs.writeFile(filepath, JSON.stringify(value))
			} catch (error) {
				console.warn('storage.init(): [key]', error)
			}
		})
	}
}

export const storage = {
	init
}
