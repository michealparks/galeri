import type { ArtObject } from '../apis/types'

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { resolve, basename } from 'path'
import { app, nativeImage } from 'electron'
import { ERROR_EEXIST, GALERI_DATA_PATH } from './constants'

const { fetch } = (globalThis as any)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

const makeFilepath = (artwork: ArtObject): string => {
	return resolve(GALERI_DATA_PATH,  `artwork_${artwork.id}${path.extname(artwork.src)}`)
}

const download = async (artwork: ArtObject): Promise<string> => {
	const output = makeFilepath(artwork)

	try {
		await mkdir(GALERI_DATA_PATH)
	} catch (err) {
		if (err.code !== ERROR_EEXIST) {
			console.warn('image.download(): ', err)
		}
	}

	await fetch(artwork.src, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		await unlink(filepath)
	} catch (err) {
		console.warn('image.remove(): ', err)
	}
}

const makeThumb = async (imagepath: string): Promise<void> => {
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
