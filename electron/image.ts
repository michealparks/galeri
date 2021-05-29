import type { ArtObject } from '../apis/types'

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { resolve, basename } from 'path'
import { app, nativeImage } from 'electron'

const { fetch } = (globalThis as any)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

const makeFilepath = (artwork: ArtObject): string => {
	const appPath = app.getPath('appData')
	const filename = `artwork_${artwork.id}${path.extname(artwork.src)}`

	return resolve(`${appPath}`, 'Galeri', filename)
}

const download = async (artwork: ArtObject): Promise<string> => {
	const output = makeFilepath(artwork)

	try {
		await mkdir(resolve(app.getPath('appData'), 'Galeri'))
	} catch {}

	await fetch(artwork.src, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		return unlink(filepath)
	} catch {
		return
	}
}

const makeThumb = async (imagepath: string) => {
	const width = 1000
	const quality = 100
	const image = nativeImage.createFromPath(imagepath)

	const filepath = resolve(app.getPath('appData'), 'Galeri Favorites', basename(imagepath))
	await writeFile(filepath, image.resize({ width }).toJPEG(quality))
}

export const image = {
	download,
	remove,
	makeFilepath,
	makeThumb,
}
