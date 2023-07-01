import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { API_KEYS } from '../apis/constants'
import * as store from '../apis/store'
import { ERROR_ENOENT, GALERI_DATA_PATH } from './constants'
import { makeDirectory, reportError } from './util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const warnMsg = 'storage.init(): '

const init = async (): Promise<void> => {
	await makeDirectory(GALERI_DATA_PATH)

	for (const api of API_KEYS) {
		try {
			const filepath = path.resolve(GALERI_DATA_PATH, `${api}.json`)
			const file = await readFile(filepath, { encoding: 'utf-8' })
			store[`${api}Store`].set(JSON.parse(file))
		} catch (error) {
			reportError(warnMsg, error, ERROR_ENOENT)
		}
	}

	try {
		const filepath = path.resolve(GALERI_DATA_PATH, 'rijksPage.json')
		const file = await readFile(filepath, { encoding: 'utf-8' })
		store.rijksPageStore.set(JSON.parse(file))
	} catch (error) {
		reportError(warnMsg, error, ERROR_ENOENT)
	}

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe((value) => {
			// @TODO this is sloppy
			if (value === undefined) {
				return
			}

			const filepath = path.resolve(GALERI_DATA_PATH, `${key}.json`)

			try {
				writeFile(filepath, JSON.stringify(value))
			} catch (error) {
				console.warn(warnMsg, error)
			}
		})
	}
}

export const storage = {
	init,
}
