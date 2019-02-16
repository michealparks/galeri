import {setWallpaper, getWallpaper} from './wallpaper/main.js'
import {getArtwork} from './museums/main.js'
import {downloadFile, deleteFile} from './util.js'
import {background} from './window/background.js'
import {toggleMenu, sendMenu} from './window/menu.js'
import {favorites} from './window/favorites.js'
import {about} from './window/about.js'
import {resolve} from 'path'
import electron, {
  app,
  ipcMain as ipc,
  systemPreferences
} from 'electron'

const settings = {
  interval: 15 * 2 * 1000
}

let originalWallpaper = ''
let currentObject = {}
let intervalId = -1
let isCycling = false

let tray, bg

app.requestSingleInstanceLock()
app.commandLine.appendSwitch('js-flags', '--use_strict')

if (!__dev && __macOS) {
  app.dock.hide()
}

ipc.on('open_about', function () {
  about()
})

ipc.on('open_favorites', function () {
  favorites()
})

app.once('ready', function () {
  tray = new electron.Tray(resolve(
    __dirname, '..', 'assets',
    systemPreferences.isDarkMode() ? 'icon-dark_32x32.png' : 'icon_32x32.png'))

  tray.on('click', onTrayClick)
  tray.on('double-click', onTrayClick)

  bg = background(electron.screen.getPrimaryDisplay())

  getWallpaper(function (err, original) {
    if (original) {
      originalWallpaper = original
    }

    cycle(err)
  })
})

function onTrayClick (e, bounds) {
  const isOpen = toggleMenu(bounds, currentObject, settings)
  tray.setHighlightMode(isOpen ? 'always' : 'never')
}

function cycle (err) {
  if (__dev && err) console.warn(err)

  getArtwork(function (err, artwork) {
    if (err !== undefined) return cycle(err)

    return downloadFile(artwork, function (err, dest) {
      if (err !== undefined) return cycle(err)

      setWallpaper(dest, function (err) {
        if (err) return process.exit(1)

        bg.webContents.send('artwork', dest)
        sendMenu('artwork', artwork)

        deleteFile(currentObject.filename || '', function () {
          currentObject = artwork
          intervalId = setTimeout(cycle, settings.interval)
        })
      })
    })
  })
}

