
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { resolve } from 'path'
import cp from 'child_process'
import { app } from 'electron'

const exec = promisify(cp.exec)
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
	const fp = filepath(url)

	try { await mkdir(resolve(app.getPath('appData'), 'Galeri')) } catch {}

	const { stdout, stderr } = await exec(`curl --compressed "${url}" --output "${fp}"`)

	return fp
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
