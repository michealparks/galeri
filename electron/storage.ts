import { app } from 'electron'
import { resolve } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { API_KEYS } from '../apis/constants'
import store from '../apis/store'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

const init = async (): Promise<void> => {
	const appPath = app.getPath('appData')

	try {
		await mkdir(resolve(appPath, 'Galeri'))
	} catch {}

	for (const api of API_KEYS) {
		try {
			const filepath = resolve(`${appPath}`, 'Galeri', `${api}.json`)
			const file = await readFile(filepath, { encoding: 'utf-8' })
			store[api].set(JSON.parse(file))
		} catch {}
	}

	try {
		const filepath = resolve(`${appPath}`, 'Galeri', `rijksPage.json`)
		const file = await readFile(filepath, { encoding: 'utf-8' })
		store.rijksPage.set(JSON.parse(file))
	} catch {}

	for (const [key, storeItem] of Object.entries(store)) {
		storeItem.subscribe((value: any) => {
			// @TODO this is sloppy
			if (value === undefined) return

			const filename = `${key}.json`
			const appPath = app.getPath('appData')
			const filepath = resolve(`${appPath}`, 'Galeri', filename)
			writeFile(filepath, JSON.stringify(value))
		})
	}
}

export const storage = {
	init
}
