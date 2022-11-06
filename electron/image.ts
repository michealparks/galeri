import type { ArtObject } from '../apis/types'

import fs from 'node:fs/promises'
import path from 'node:path'
import { app, nativeImage } from 'electron'
import { ERROR_EEXIST, GALERI_DATA_PATH } from './constants'
import { isErrnoException } from './util'

const { fetch } = globalThis

const makeFilepath = (artwork: ArtObject): string => {
	return path.resolve(GALERI_DATA_PATH,  `artwork_${artwork.id}${path.extname(artwork.src)}`)
}

const download = async (artwork: ArtObject): Promise<string> => {
	const output = makeFilepath(artwork)

	try {
		await fs.mkdir(GALERI_DATA_PATH)
	} catch (error) {
		if (isErrnoException(error) && error.code !== ERROR_EEXIST) {
			console.warn('image.download():', error)
		}
	}

	await fetch(artwork.src, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		await fs.unlink(filepath)
	} catch (error) {
		console.warn('image.remove():', error)
	}
}

const makeThumb = async (imagepath: string): Promise<void> => {
	const width = 1000
	const quality = 100
	const image = nativeImage.createFromPath(imagepath)
	const filepath = path.resolve(app.getPath('appData'), 'Galeri Favorites', path.basename(imagepath))

	await fs.writeFile(filepath, image.resize({ width }).toJPEG(quality))
}

export const image = {
	download,
	remove,
	makeFilepath,
	makeThumb,
}
