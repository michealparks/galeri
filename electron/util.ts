import fs from 'fs/promises'
import { join } from 'path'
import { GALERI_DATA_PATH } from './constants'

export const isFirstAppLaunch = async (): Promise<boolean> => {
  const checkFile = join(GALERI_DATA_PATH, '.electron-util--has-app-launched')

  try {
    await fs.stat(checkFile)
    return false
  } catch {
    try {
      await fs.writeFile(checkFile, '')
    } catch (err) {
      console.warn('isFirstAppLaunch(): ', err)
    }
  }

  return true
}

export const isErrnoException = (e: unknown): e is NodeJS.ErrnoException => {
  if ('code' in (e as { code: unknown })) return true
  else return false
}
