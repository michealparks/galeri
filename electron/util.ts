import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { GALERI_DATA_PATH } from './constants'

const stat = promisify(fs.stat)
const writeFile = promisify(fs.writeFile)

console.log(GALERI_DATA_PATH)

export const isFirstAppLaunch = async (): Promise<boolean> => {
  const checkFile = join(GALERI_DATA_PATH, '.electron-util--has-app-launched')

  try {
    await stat(checkFile)
    return false
  } catch {
    try {
      await writeFile(checkFile, '')
    } catch (err) {
      console.warn('isFirstAppLaunch(): ', err)
    }
  }

  return true
}
