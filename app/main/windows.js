module.exports = {openFavorites, openAbout}

const __dev__ = process.env.NODE_ENV === 'development'
const {BrowserWindow} = require('electron')
const {format} = require('url')
const {resolve} = require('path')

let aboutWin, favoritesWin

const config = {
  center: true,
  show: false,
  width: 0,
  height: 0,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  titleBarStyle: 'hidden-inset',
  webPreferences: {
    webAudio: false,
    webgl: false
  }
}

function getUrl (name) {
  return format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, __dev__ ? '..' : 'build', name + '.html')
  })
}

function openFavorites () {
  if (favoritesWin !== undefined) {
    favoritesWin.focus()
    favoritesWin.restore()
    return favoritesWin.id
  }

  config.width = 790
  config.height = 550

  favoritesWin = new BrowserWindow(config)
  favoritesWin.once('ready-to-show', favoritesWin.show)
  favoritesWin.on('close', function () { favoritesWin = undefined })
  favoritesWin.loadURL(getUrl('favorites'))

  if (__dev__) favoritesWin.openDevTools({ mode: 'detach' })

  return favoritesWin.id
}

function openAbout () {
  if (aboutWin !== undefined) {
    aboutWin.focus()
    aboutWin.restore()
    return aboutWin.id
  }

  config.width = 400
  config.height = 300

  aboutWin = new BrowserWindow(config)
  aboutWin.once('ready-to-show', aboutWin.show)
  aboutWin.on('close', function () { aboutWin = undefined })
  aboutWin.loadURL(getUrl('about'))

  if (__dev__) aboutWin.openDevTools({ mode: 'detach' })

  return aboutWin.id
}
