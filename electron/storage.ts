import { resolve } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { API_KEYS } from '../apis/constants'
import store from '../apis/store'
import { ERROR_EEXIST, ERROR_ENOENT, GALERI_DATA_PATH } from './constants'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

const init = async (): Promise<void> => {
	try {
		await mkdir(GALERI_DATA_PATH)
	} catch (err) {
		if (err.code !== ERROR_EEXIST) {
			console.warn('storage.init(): ', err)
		}
	}

	for (const api of API_KEYS) {
		try {
			const filepath = resolve(GALERI_DATA_PATH, `${api}.json`)
			const file = await readFile(filepath, { encoding: 'utf-8' })
			store[api].set(JSON.parse(file))
		} catch (err) {
			if (err.code !== ERROR_ENOENT) {
				console.warn('storage.init(): ', err)
			}
		}
	}

	try {
		const filepath = resolve(GALERI_DATA_PATH, 'rijksPage.json')
		const file = await readFile(filepath, { encoding: 'utf-8' })
		store.rijksPage.set(JSON.parse(file))
	} catch (err) {
		if (err.code !== ERROR_ENOENT) {
			console.warn('storage.init(): ', err)
		}
	}

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe((value) => {
			// @TODO this is sloppy
			if (value === undefined) {
				return
			}

			const filepath = resolve(GALERI_DATA_PATH, `${key}.json`)

			try {
				writeFile(filepath, JSON.stringify(value))
			} catch (err) {
				console.warn('storage.init(): [key] ', err)
			}
		})
	}
}

export const storage = {
	init
}
