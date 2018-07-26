import {readFile, writeFile, rename, unlink, rmdir} from 'fs'
import path from 'path'
import applicationConfigPath from './app-config-path'
import mkdirp from './mkdirp'

let filePath

const tryCatch = (str) => {
  try {
    return JSON.parse(str)
  } catch (err) {
    return undefined
  }
}

const read = (next) => {
  readFile(filePath, (err, raw) => {
    if (err && err.code === 'ENOENT') return next(undefined, {})
    if (err) return next(err)

    let data = tryCatch(raw.toString())

    next(data === undefined ? 1 : undefined, data)
  })
}

const write = (data, next) => {
  const directoryPath = path.dirname(filePath)

  mkdirp(directoryPath, (err) => {
    if (err) return next(err)

    const tempFilePath =
      filePath + '-' +
      Math.random().toString().substr(2) +
      Date.now().toString() +
      path.extname(filePath)

    writeFile(tempFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return next(err)
      rename(tempFilePath, filePath, next)
    })
  })
}

const trash = (next) => {
  unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') return next(err)

    const directoryPath = path.dirname(filePath)
    rmdir(directoryPath, (err) => {
      if (err && err.code !== 'ENOENT') return next(err)
      next(undefined)
    })
  })
}

export default (name) => {
  filePath = path.join(applicationConfigPath(name), 'config.json')
  return {read, write, trash}
}
