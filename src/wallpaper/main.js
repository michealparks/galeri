const path = require('path')
const cp = require('child_process')

// Binary source → https://github.com/sindresorhus/macos-wallpaper
const bin = __macOS
  ? path.resolve('./build', 'macos-wallpaper')
  : win
  ? path.resolve('./build', 'win-wallpaper.exe')
  : ''

const macArgs = ['set', '', '--screen', 'all', '--scale', 'auto']

export function setWallpaper (imagePath, cb) {
  if (typeof imagePath !== 'string') {
    throw new TypeError('Expected a string')
  }

  if (__macOS) {
    macArgs[1] = path.resolve(imagePath)
  }
  
  const args = __macOS ? macArgs : __win ? [path.resolve(imagePath)] : undefined

  return cp.execFile(bin, args, function (err, stdout, stderr) {
    return cb(err || stderr, stdout)
  })
}

export function getWallpaper (cb) {
  return cp.execFile(bin, ['get'], function (err, stdout, stderr) {
    return cb(err || stderr, stdout.trim())
  })
}
