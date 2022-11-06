import fs from 'node:fs/promises'
import path from 'node:path'
import { GALERI_DATA_PATH } from './constants'

export const isFirstAppLaunch = async (): Promise<boolean> => {
  const checkFile = path.join(GALERI_DATA_PATH, '.electron-util--has-app-launched')

  try {
    await fs.stat(checkFile)
    return false
  } catch {
    try {
      await fs.writeFile(checkFile, '')
    } catch (error) {
      console.warn('isFirstAppLaunch():', error)
    }
  }

  return true
}

export const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return ('code' in (error as { code: unknown }))
}
