import {nativeImage} from 'electron'
import http from 'http'
import https from 'https'
import {extname, join, parse} from 'path'
import {stat, mkdir, createWriteStream, unlink, readFile, writeFile} from 'fs'

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

function makeThumb (artwork, cb) {
  const {filename, filepath} = artwork
  const thumbPath = join(appPath, `${parse(filename).name}_thumb${extname(filename)}`)
  const image = nativeImage.createFromPath(filepath)
  const {width, height} = image.getSize()

  writeFile(thumbPath, image
    .resize(width > height
      ? {height: 300, quality: 'best'}
      : {width: 300, quality: 'best'})
    .toJPEG(100),
  function(err) {
    if (err) cb(err)

    artwork.thumbPath = thumbPath
    cb()
  })

}

export function downloadImage (artwork, cb) {
  checkAppPath(function () {
    artwork.filepath = join(appPath, artwork.filename)

    const file = createWriteStream(artwork.filepath)

    file.on('finish', function () {
      file.close(function (err) {
        makeThumb(artwork, function () {
          cb(err, artwork)
        })
      }) 
    })

    file.on('error', function (err) {
      unlink(artwork.filepath, function () {})
      cb(err.message)
    })

    const protocol = artwork.src.indexOf('http://') > -1 ? http : https
    const request = protocol.get(artwork.src, function (response) {
      if (response.statusCode !== 200) {
        return cb('Response status was ' + response.statusCode)
      }

      response.pipe(file)
    })

    request.setTimeout(10000)

    request.on('error', function (err) {
      unlink(artwork.filepath, function () {})
      cb(err.message)
    })
  })
}

export function deleteImage (artwork, cb) {
  unlink(artwork.thumbPath, function (err) {
    unlink(artwork.filepath, function (err2) {
      if (cb) cb(err || err2 ? {err, err2} : undefined)
    })
  })
}

export function requestJSON (url, cb) {
  const protocol = url.indexOf('http://') > -1 ? http : https

  const request = protocol.get(url, {
    headers: { 'User-Agent': 'michealparks' }
  }, function (response) {
    let str = ''

    response.on('data', function (chunk) {
      str = `${str}${chunk}`
    })

    response.on('end', function () {
      if (response.statusCode !== 200) {
        return (cb(`${response.statusCode}: ${url}`))
      }

      try {
        const json = JSON.parse(str)
        cb(undefined, json)
      } catch (err) {
        cb(err)
      }
    })
  })

  request.setTimeout(10000)

  request.on('error', function (err) {
    cb(err)
  })
}

export function readJSON (file, fn) {
  checkAppPath(function () {
    const filepath = join(appPath, `${file}.json`)

    readFile(filepath, function (err, data) {
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

export function writeJSON (file, object, fn) {
  checkAppPath(function () {
    const filepath = join(appPath, `${file}.json`)
    const str = JSON.stringify(object, null, 2)
    
    writeFile(filepath, str, function (err) {
      if (err) fn && fn(err)
      else fn && fn()
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
