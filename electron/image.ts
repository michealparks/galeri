
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { resolve } from 'path'
import { app } from 'electron'

const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)

const filepath = (url: string) => {
	const hash = crypto
		.createHash('md5')
		.update(url)
		.digest('base64')
		.replace(/\//g, '0')
		.replace('==', '2')
		.replace('=', '1')

	const appPath = app.getPath('appData')
	const filename = `artwork_${hash}${path.extname(url)}`

	return resolve(`${appPath}`, 'Galeri', filename)
}

const download = async (url: string): Promise<string> => {
	const output = filepath(url)

	try { await mkdir(resolve(app.getPath('appData'), 'Galeri')) } catch {}

	await (globalThis as any).fetch(url, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		return unlink(filepath)
	} catch {
		return
	}
}

export const image = {
	filepath,
	download,
	remove
}
