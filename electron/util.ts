import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { ERROR_EEXIST, GALERI_DATA_PATH } from './constants'

const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

export const makeDirectory = async (path: string): Promise<void> => {
	try {
		await mkdir(path)
	} catch (error) {
		reportError('makeDirectory(): ', error, ERROR_EEXIST)
	}
}

export const reportError = (prefix: string, error: unknown, ...exceptions: string[]): void => {
	const { code } = error as { code: string }

	if (exceptions.includes(code) === false) {
		console.warn(prefix, JSON.stringify(error))
	}
}

export const isFirstAppLaunch = async (): Promise<boolean> => {
	const checkFile = path.join(GALERI_DATA_PATH, '.electron-util--has-app-launched')

	try {
		await stat(checkFile)
		return false
	} catch {
		try {
			await writeFile(checkFile, '')
		} catch (error) {
			reportError('isFirstAppLaunch():', error)
		}
	}

	return true
}
