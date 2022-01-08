import type { ArtObject } from '../apis/types'

import fs from 'fs/promises'
import path from 'path'
import { resolve, basename } from 'path'
import { app, nativeImage } from 'electron'
import { ERROR_EEXIST, GALERI_DATA_PATH } from './constants'
import { isErrnoException } from './util'

const { fetch } = globalThis

const makeFilepath = (artwork: ArtObject): string => {
	return resolve(GALERI_DATA_PATH,  `artwork_${artwork.id}${path.extname(artwork.src)}`)
}

const download = async (artwork: ArtObject): Promise<string> => {
	const output = makeFilepath(artwork)

	try {
		await fs.mkdir(GALERI_DATA_PATH)
	} catch (err) {
		if (isErrnoException(err) && err.code !== ERROR_EEXIST) {
			console.warn('image.download(): ', err)
		}
	}

	await fetch(artwork.src, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		await fs.unlink(filepath)
	} catch (err) {
		console.warn('image.remove(): ', err)
	}
}

const makeThumb = async (imagepath: string): Promise<void> => {
	const width = 1000
	const quality = 100
	const image = nativeImage.createFromPath(imagepath)
	const filepath = resolve(app.getPath('appData'), 'Galeri Favorites', basename(imagepath))

	await fs.writeFile(filepath, image.resize({ width }).toJPEG(quality))
}

export const image = {
	download,
	remove,
	makeFilepath,
	makeThumb,
}
