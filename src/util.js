const http = require('http')
const https = require('https')
const {join} = require('path')
const {stat, mkdir, createWriteStream, unlink, readFile, writeFile} = require('fs')

const appPath = __macOS
  ? join(process.env['HOME'], 'Library', 'Application Support', 'Galeri')
  : __linux
  ? process.env['XDG_CONFIG_HOME']
    ? join(process.env['XDG_CONFIG_HOME'], 'Galeri')
    : join(process.env['HOME'], '.config', 'Galeri')
  : __windows
  ? process.env['LOCALAPPDATA']
    ? join(process.env['LOCALAPPDATA'], 'Galeri')
    : join(process.env['USERPROFILE'], 'Local Settings', 'Application Data', 'Galeri')
  : undefined

function checkAppPath (cb) {
  stat(appPath, function (err) {
    if (!err) return cb()

    const mode = parseInt('0777', 8) & (~process.umask())

    mkdir(appPath, mode, function (err) {
      if (err) { cb(err) } else { cb() }
    })
  })
}

export function downloadFile (artwork, cb) {
  checkAppPath(function () {
    const dest = join(appPath, artwork.filename)
    const file = createWriteStream(dest)
    const protocol = artwork.src.indexOf('http://') > -1 ? http : https

    const request = protocol.get(artwork.src, function (response) {
      if (response.statusCode !== 200) {
        return cb('Response status was ' + response.statusCode)
      }

      response.pipe(file)
    })

    request.on('error', function (err) {
      unlink(dest, function () {})
      cb(err.message)
    })

    file.on('finish', function () {
      file.close(function (err) {
        cb(err, dest)
      }) 
    })

    file.on('error', function (err) {
      unlink(dest, function () {})
      cb(err.message)
    })
  })
}

export function deleteFile (filename, cb) {
  unlink(join(appPath, filename), cb)
}

export function requestJSON (url, cb) {
  const protocol = url.indexOf('http://') > -1 ? http : https

  const request = protocol.get(url, function (response) {
    let str = ''

    response.on('data', function (chunk) {
      str = `${str}${chunk}`
    })

    response.on('end', function () {
      try {
        const json = JSON.parse(str)
        cb(undefined, json)
      } catch (err) {
        cb(err)
      }
    })
  })

  request.on('error', function (err) {
    cb(err)
  })
}

export function readJSON (file, fn) {
  checkAppPath(function () {
    readFile(file, function (err, data) {
      if (err) return fn(err)

      try {
        const json = JSON.parse(data)
        fn(undefined, json)
      } catch (err) {
        fn(err)
      }
    })
  })
}

export function writeJSON (object, fn) {
  checkAppPath(function () {
    const dest = join(appPath, file)
    const str = JSON.stringify(object, null, 2)
    
    writeFile(dest, str, function (err) {
      if (err) { fn(err) } else { fn() }
    })
  })
}

export function shuffleArray (array) {
  let counter = array.length
  let index = 0, temp

  while (counter > 0) {
    index = Math.random() * counter | 0
    counter -= 1

    temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
}
