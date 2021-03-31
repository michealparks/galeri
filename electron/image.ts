
import fs from 'fs'
import crypto from 'crypto'
import { promisify } from 'util'
import { resolve } from 'path'
import FileType from 'file-type'
import { app } from 'electron'
import { fetchArrayBuffer } from '../utils/fetch'

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

const createHash = (url: string): string => {
  return crypto
    .createHash('md5')
    .update(url)
    .digest('base64')
    .replace(/\//g, '0')
    .replace('==', '2')
    .replace('=', '1')
}

const write = async (url: string, buffer: ArrayBuffer): Promise<string> => {
  const fileTypeResult = await FileType.fromBuffer(buffer)

  if (fileTypeResult === undefined) {
    throw new Error()
  }

  const { ext } = fileTypeResult
  const filename = `artwork_${createHash(url)}.${ext}`
  const appPath = app.getPath('appData')
  const path = resolve(`${appPath}`, 'Galeri', filename)

  try {
    await mkdir(resolve(appPath, 'Galeri'))
  } catch (err) {}

  await writeFile(path, Buffer.from(buffer))

  return path
}

// Fetches and image, writes it to disk, and returns a filepath
const download = async (url: string): Promise<string> => {
  return write(url, await fetchArrayBuffer(url))
}

// Writes an image buffer and returns its filepath
const fromBuffer = (url: string, arrayBuffer: ArrayBuffer): Promise<string> => {
  return write(url, arrayBuffer)
}

export const image = {
  download,
  fromBuffer
}

