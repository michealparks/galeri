
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { promisify } from 'util'
import { resolve } from 'path'
import cp from 'child_process'
import { app } from 'electron'

const exec = promisify(cp.exec)
const mkdir = promisify(fs.mkdir)

const createHash = (url: string): string => {
	return crypto
		.createHash('md5')
		.update(url)
		.digest('base64')
		.replace(/\//g, '0')
		.replace('==', '2')
		.replace('=', '1')
}

const download = async (url: string): Promise<string> => {
	const filename = `artwork_${createHash(url)}${path.extname(url)}`
	const appPath = app.getPath('appData')
	const filepath = resolve(`${appPath}`, 'Galeri', filename)

	try { await mkdir(resolve(appPath, 'Galeri')) } catch {}

	const { stdout, stderr } = await exec(`curl --compressed "${url}" --output "${filepath}"`)

	return filepath
}

export const image = {
	download
}
