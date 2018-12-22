import electron from 'electron'
import wallpaper from 'wallpaper'
import {getArtwork} from './museums/main'
import {downloadFile, deleteFile} from './util'

let originalWallpaper = ''
let currentObject = {}

function main () {
  const app = electron.app

  app.requestSingleInstanceLock()
  app.commandLine.appendSwitch('js-flags', '--use_strict')

  if (__macOS) {
    app.dock.hide()
  }

  app.once('ready', function () {
    wallpaper.get().then(function (original) {
      originalWallpaper = original
      cycle()
    }).catch(cycle)
    
  })
}

function cycle () {
  getArtwork(function (err, artwork) {
    if (err) return cycle()
    console.log(1, err, artwork.source)

    downloadFile(artwork.filename, artwork.src, function (err, dest) {
      if (err) return cycle(err)
      console.log(2, err, dest)

      wallpaper.set(dest)
        .then(function () {
          console.log(3)
          setTimeout(cycle, 30 * 1000)
          deleteFile(currentObject.filename || '')

          currentObject = artwork
        })
        .catch(function () {
          process.exit(1)
        })
    })
  })
}

main()
