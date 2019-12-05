import {setWallpaper, getWallpaper} from './wallpaper/main'
import {getArtwork} from './museums/main'
import {autoupdate} from './util/autoupdate'
import {downloadImage, deleteImage, writeJSON, readJSON} from './util'
import {background} from './window/background'
import {toggleMenu, sendMenu} from './window/menu'
import {favorites, sendFavorites} from './window/favorites'
import {about} from './window/about'
import {resolve} from 'path'
import electron, {app, systemPreferences, ipcMain as ipc} from 'electron'

const settings = {
  refreshRate: 15 * 2 * 1000,
  autolaunch: true
}

const favoritesArray = []

let currentObject = {filename: ''}
let pendingObject = {filename: ''}
let pendingDest = ''

let originalWallpaper = ''
let startCycleId = -1
let startCycleStamp = 0.0, suspendStamp = 0.0
let isCycling = false
let isSuspended = false

let tray, bg

autoupdate()
app.requestSingleInstanceLock()
app.commandLine.appendSwitch('js-flags', '--use_strict')

if (!__dev && __macOS) {
  app.dock.hide()
}

ipc.on('settings', function (e, newSettings) {
  for (let key in newSettings) {
    settings[key] = newSettings[key]
  }

  saveData()

  // TODO apply settings
})

ipc.on('open_about', function () {
  about()
})

ipc.on('open_favorites', function () {
  favorites(favoritesArray)
})

ipc.on('toggle_favorite', onToggleFavorite)

ipc.on('delete_favorite', function (e, filename) {
  if (filename === currentObject.filename) {
    return onToggleFavorite()
  }

  favoritesArray.splice(
    findFavoriteIndex(favoritesArray, filename),
    1)

  sendFavorites('favorites', favoritesArray)
  saveData()
})

ipc.on('background_error', function () {
  startCycle()
})

ipc.on('background_success', function () {
  onSuccess()
})

app.once('ready', function () {
  readJSON('galeri', function (err, json) {
    if (err === undefined) {
      for (let key in json.settings) {
        settings[key] = json.settings[key]
      }

      currentObject = json.currentObject

      json.favoritesArray.forEach(function (arrItem) {
        favoritesArray.push(arrItem)
      })
    }

    const {powerMonitor} = electron

    powerMonitor.on('suspend', onSuspend)
    powerMonitor.on('lock-screen', onSuspend)
    powerMonitor.on('resume', onResume)
    powerMonitor.on('unlock-screen', onResume)

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

      startCycle(err)
    })
  })
})

function saveData (fn) {
  writeJSON('galeri', {
    settings,
    favoritesArray,
    currentObject
  }, fn)
}

function onToggleFavorite () {
  currentObject.isFavorite = !currentObject.isFavorite

  if (currentObject.isFavorite) {
    favoritesArray.push(currentObject)
  } else {
    favoritesArray.splice(
      findFavoriteIndex(favoritesArray, currentObject.filename),
      1)
  }
  
  sendMenu('artwork', currentObject)
  sendFavorites('favorites', favoritesArray)

  saveData()
}

function findFavoriteIndex (arr, name) {
  return arr.findIndex(function ({filename}) {
    return filename === name
  })
}

function onSuspend () {
  if (startCycleId !== undefined) {
    clearTimeout(startCycleId)
    startCycleId = undefined
  }

  suspendStamp = Date.now()
  isSuspended = true
}

function onResume () {
  isSuspended = false

  if (isCycling) return

  if (startCycleId !== undefined) {
    clearTimeout(startCycleId)
  }

  const timeLeft = settings.refreshRate - (Date.now() - startCycleStamp)
  const suspendTime = Date.now() - suspendStamp
  const time = timeLeft - suspendTime

  setTimeout(startCycle, time < 0 ? 0 : time)
}

function onTrayClick (e, bounds) {
  const isOpen = toggleMenu(bounds, currentObject, settings)
  tray.setHighlightMode(isOpen ? 'always' : 'never')
}

function startCycle (err) {
  if (__dev && err) console.error(err)

  isCycling = true
  getArtwork(onGetArtwork)
}

function onGetArtwork (err, artwork) {
  if (err !== undefined) return startCycle(err)

  pendingObject = artwork

  downloadImage(pendingObject, onImageDownload)
}

function onImageDownload (err, artwork) {
  if (err !== undefined) return startCycle(err)

  bg.webContents.send('artwork', pendingObject.filepath)
}

function onSuccess () {
  sendMenu('artwork', pendingObject)

  if (currentObject.isFavorite === false) {
    deleteImage(currentObject)
  }

  currentObject = pendingObject

  saveData()

  isCycling = false

  if (isSuspended) return

  startCycleId = setTimeout(startCycle, settings.refreshRate)
  startCycleStamp = Date.now()
}
