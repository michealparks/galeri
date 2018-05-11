const {readFile, writeFile, rename, unlink, rmdir} = require('fs')
const {join, dirname, extname} = require('path')
const mkdirp = require('./mkdirp')
const appConfigPath = require('./app-config-path')
const filePath = join(appConfigPath('Galeri'), 'config.json')

const tryCatch = (str) => {
  try {
    return [undefined, JSON.parse(str)]
  } catch (err) {
    return [err, undefined]
  }
}

const read = (next) => readFile(filePath, (err, raw) => {
  if (err && err.code === 'ENOENT') return next(undefined, {})
  if (err) return next(err)

  const [jsonErr, data] = tryCatch(raw.toString())

  next(jsonErr, data)
})

const write = (data, next) => {
  const directoryPath = dirname(filePath)

  mkdirp(directoryPath, (err) => {
    if (err) return next(err)

    const tempFilePath =
      filePath + '-' +
      Math.random().toString().substr(2) +
      Date.now().toString() +
      extname(filePath)

    writeFile(tempFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return next(err)
      rename(tempFilePath, filePath, next)
    })
  })
}

const del = (next) => unlink(filePath, (err) => {
  if (err && err.code !== 'ENOENT') return next(err)

  const directoryPath = dirname(filePath)
  rmdir(directoryPath, (err) => err ? next(err) : next())
})

module.exports = {read, write, del}
