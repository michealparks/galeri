import {setWallpaper, getWallpaper} from './wallpaper/main.js'
import {getArtwork} from './museums/main.js'
import {downloadFile, deleteFile} from './util.js'

const electron = require('electron')

let originalWallpaper = ''
let currentObject = {}
let interval = 60 * 2 * 1000
let intervalId = -1
let isCycling = false

function main () {
  const app = electron.app

  app.requestSingleInstanceLock()
  app.commandLine.appendSwitch('js-flags', '--use_strict')

  if (__macOS) {
    app.dock.hide()
  }

  return app.once('ready', function () {
    return getWallpaper(function (err, original) {
      if (original) {
        originalWallpaper = original
      }
      
      return cycle()
    })
  })
}

function cycle () {
  return getArtwork(function (err, artwork) {
    if (err !== undefined) return cycle()

    return downloadFile(artwork.filename, artwork.src, function (err, dest) {
      if (err !== undefined) return cycle()

      return setWallpaper(dest, function (err) {
        console.error(err)
        if (err) return process.exit(1)

        return deleteFile(currentObject.filename || '', function () {
          currentObject = artwork
          intervalId = setTimeout(cycle, interval)
        })
      })
    })
  })
}

main()
