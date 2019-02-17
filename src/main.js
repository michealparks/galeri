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

let currentObject = {filename: ''}
let pendingObject = {filename: ''}

let originalWallpaper = ''
let cycleId = -1
let isCycling = false
let isSuspended = false

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

ipc.on('background_error', function () {
  console.log('SHOULD NEVER OCCUR')
  clearTimeout(cycleId)

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

function onSuspend () {
  cycleId = undefined
  isSuspended = true

  clearTimeout(cycleId)
}

function onResume () {
  isSuspended = false

  if (cycleId !== undefined) {
    clearTimeout(cycleId)
  }

  cycle()
}

function onTrayClick (e, bounds) {
  const isOpen = toggleMenu(bounds, currentObject, settings)
  tray.setHighlightMode(isOpen ? 'always' : 'never')
}

function cycle (err) {
  if (__dev && err) console.warn(err)

  isCycling = true
  getArtwork(onGetArtwork)
}

function onGetArtwork (err, artwork) {
  if (err !== undefined) return cycle(err)

  pendingObject = artwork

  downloadFile(artwork, onFileDownload)
}

function onFileDownload (err, dest) {
  if (err !== undefined) return cycle(err)

  bg.webContents.send('artwork', dest)

  sendMenu('artwork', pendingObject)
  setWallpaper(dest, onWallpaperSet)
}

function onWallpaperSet (err) {
  if (err) return process.exit(1)

  setTimeout(deleteFile, 3000, currentObject.filename, onFileDelete)
}

function onFileDelete () {
  currentObject = pendingObject
  pendingObject = undefined

  if (isSuspended) return

  cycleId = setTimeout(cycle, settings.interval)
  isCycling = false
}

