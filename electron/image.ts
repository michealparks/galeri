import type { ArtObject } from '../apis/types'

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { app, nativeImage } from 'electron'
import { GALERI_DATA_PATH } from './constants'
import { fetch } from './fetch'
import { makeDirectory, reportError } from './util'

const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

const makeFilepath = (artwork: ArtObject): string => {
	return path.resolve(GALERI_DATA_PATH, `artwork_${artwork.id}${path.extname(artwork.src)}`)
}

const download = async (artwork: ArtObject): Promise<string> => {
	const output = makeFilepath(artwork)

	await makeDirectory(GALERI_DATA_PATH)
	await fetch(artwork.src, { output })

	return output
}

const remove = async (filepath: string): Promise<void> => {
	try {
		await unlink(filepath)
	} catch (error) {
		reportError('image.remove(): ', error)
	}
}

const makeThumb = async (imagepath: string): Promise<void> => {
	const width = 1000
	const quality = 100
	const image = nativeImage.createFromPath(imagepath)
	const filepath = path.resolve(app.getPath('appData'), 'Galeri Favorites', path.basename(imagepath))

	await writeFile(filepath, image.resize({ width }).toJPEG(quality))
}

export const image = {
	download,
	remove,
	makeFilepath,
	makeThumb,
}
