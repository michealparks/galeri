import { app } from 'electron'
import { resolve } from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { API_KEYS } from '../apis/constants'
import { store } from '../apis/store'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

store.subscribeAll(async (key: string, value: any) => {
	const filename = `${key}.json`
	const appPath = app.getPath('appData')
	const filepath = resolve(`${appPath}`, 'Galeri', filename)

	await writeFile(filepath, JSON.stringify(value))
})

const init = async () => {
	const appPath = app.getPath('appData')

	try { await mkdir(resolve(appPath, 'Galeri')) } catch {}

	for (const api of API_KEYS) {
		try {
			const filepath = resolve(`${appPath}`, 'Galeri', `${api}.json`)
			const file = await readFile(filepath, { encoding: 'utf-8' })
			store.set(api, JSON.parse(file))
		} catch {
			store.set(api, [])
		}
	}

	try {
		const filepath = resolve(`${appPath}`, 'Galeri', `rijksPage.json`)
		const file = await readFile(filepath, { encoding: 'utf-8' })
		store.set('rijksPage', JSON.parse(file))
	} catch {
		store.set('rijksPage', 1)
	}
}

export const storage = {
	init
}
