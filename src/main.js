import {setWallpaper, getWallpaper} from './wallpaper/main'
import {getArtwork} from './museums/main'
import {downloadImage, deleteImage} from './util'
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
let cycleId = -1
let cycleStamp = 0.0, suspendStamp = 0.0
let isCycling = false
let isSuspended = false

let tray, bg

app.requestSingleInstanceLock()
app.commandLine.appendSwitch('js-flags', '--use_strict')

if (!__dev && __macOS) {
  app.dock.hide()
}

ipc.on('settings', function (e, newSettings) {
  for (key in newSettings) {
    settings[key] = newSettings[key]
  }

  // TODO apply settings
  // TODO persist
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

  // TODO persist
})

ipc.on('background_error', function () {
  onSuspend()
  onResume()
})

app.once('ready', function () {
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

    cycle(err)
  })
})

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

  // TODO persist
}

function findFavoriteIndex (arr, name) {
  return arr.findIndex(function ({filename}) {
    return filename === name
  })
}

function onSuspend () {
  if (cycleId !== undefined) {
    clearTimeout(cycleId)
    cycleId = undefined
  }

  suspendStamp = Date.now()
  isSuspended = true
}

function onResume () {
  isSuspended = false

  if (isCycling) return

  if (cycleId !== undefined) {
    clearTimeout(cycleId)
  }

  const timeLeft = settings.refreshRate - (Date.now() - cycleStamp)
  const suspendTime = Date.now() - suspendStamp
  const time = timeLeft - suspendTime

  setTimeout(cycle, time < 0 ? 0 : time)
}

function onTrayClick (e, bounds) {
  const isOpen = toggleMenu(bounds, currentObject, settings)
  tray.setHighlightMode(isOpen ? 'always' : 'never')
}

function cycle (err) {
  if (__dev && err) console.error(err)

  isCycling = true
  getArtwork(onGetArtwork)
}

function onGetArtwork (err, artwork) {
  if (err !== undefined) return cycle(err)

  pendingObject = artwork

  downloadImage(pendingObject, onImageDownload)
}

function onImageDownload (err, artwork) {
  if (err !== undefined) return cycle(err)

  bg.webContents.send('artwork', pendingObject.filepath)
  sendMenu('artwork', pendingObject)
  setWallpaper(pendingObject.filepath, onWallpaperSet)
}

function onWallpaperSet (err) {
  if (err !== undefined) return cycle(err)

  setTimeout(function () {
    if (currentObject.isFavorite === false) {
      deleteImage(currentObject, onCycleFinish)
    } else {
      onCycleFinish()
    }
  }, 3000)
}

function onCycleFinish () {
  currentObject = pendingObject

  if (isSuspended) return

  cycleId = setTimeout(cycle, settings.refreshRate)
  cycleStamp = Date.now()
  isCycling = false
}

