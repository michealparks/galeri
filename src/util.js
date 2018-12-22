const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')

const appPath = __macOS
  ? path.join(process.env['HOME'], 'Library', 'Application Support', 'Galeri')
  : __linux
  ? process.env['XDG_CONFIG_HOME']
    ? path.join(process.env['XDG_CONFIG_HOME'], 'Galeri')
    : path.join(process.env['HOME'], '.config', 'Galeri')
  : __windows
  ? process.env['LOCALAPPDATA']
    ? path.join(process.env['LOCALAPPDATA'], 'Galeri')
    : path.join(process.env['USERPROFILE'], 'Local Settings', 'Application Data', 'Galeri')
  : undefined

function checkAppPath (cb) {
  return fs.stat(appPath, function (err) {
    if (!err) return cb()

    const mode = parseInt('0777', 8) & (~process.umask())

    fs.mkdir(appPath, mode, function (err) {
      if (err) console.error(err)
      return cb()
    })
  })
}

export function downloadFile (filename, url, cb) {
  return checkAppPath(function () {
    const dest = path.join(appPath, filename)
    const file = fs.createWriteStream(dest)
    const protocol = url.indexOf('http://') > -1 ? http : https

    const request = protocol.get(url, function (response) {
      if (response.statusCode !== 200) {
        return cb('Response status was ' + response.statusCode)
      }

      return response.pipe(file)
    })

    request.on('error', function (err) {
      fs.unlink(dest, function () {})
      return cb(err.message)
    })

    file.on('finish', function () {
      return file.close(function (err) {
        return cb(err, dest)
      }) 
    })

    file.on('error', function (err) {
      fs.unlink(dest, function () {})
      return cb(err.message)
    })
  })
}

export function deleteFile (filename, cb) {
  return fs.unlink(path.join(appPath, filename), cb)
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
        return cb(undefined, json)
      } catch (err) {
        return cb(err)
      }
    })
  })

  request.on('error', function (err) {
    return cb(err)
  })
}

export function shuffleArray (array) {
  for (let i = array.length - 1, j, t; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1))
    t = array[i]
    array[i] = array[j]
    array[j] = t
  }

  return array
}
