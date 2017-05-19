module.exports = appConfig

const fs = require('fs')
const path = require('path')
const applicationConfigPath = require('./app-config-path')

let filePath

function appConfig (name) {
  filePath = path.join(applicationConfigPath(name), 'config.json')
  return {read, write, trash}
}

function tryCatch (str) {
  try {
    return JSON.parse(str)
  } catch (err) {
    return undefined
  }
}

function read (next) {
  fs.readFile(filePath, (err, raw) => {
    if (err && err.code === 'ENOENT') return next(undefined, {})
    if (err) return next(err)

    let data = tryCatch(raw.toString())

    next(data === undefined ? 1 : undefined, data)
  })
}

function write (data, next) {
  const mkdirp = require('./mkdirp')
  const directoryPath = path.dirname(filePath)

  mkdirp(directoryPath, (err) => {
    if (err) return next(err)

    const tempFilePath =
      filePath + '-' +
      Math.random().toString().substr(2) +
      Date.now().toString() +
      path.extname(filePath)

    fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return next(err)
      fs.rename(tempFilePath, filePath, next)
    })
  })
}

function trash (next) {
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') return next(err)

    const directoryPath = path.dirname(filePath)
    fs.rmdir(directoryPath, (err) => {
      if (err && err.code !== 'ENOENT') return next(err)
      next(undefined)
    })
  })
}
