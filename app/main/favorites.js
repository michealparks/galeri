import {BrowserWindow} from 'electron'
import appConfig from '../shared/app-config'
import {APP_ICON} from '../../config'
import {getArt, addListener} from './ipc'
import {makeThumb, removeThumb} from './thumb'
import {getUrl} from './util'

const cache = appConfig('Galeri Favorites')

let win
let favorites = []

cache.read((err, data) => {
  if (err) return
  favorites = data.favorites || []
})

addListener('open-favorites-window', () =>
  openFavorites())
addListener('menubar:is-favorited', (isFavorited) =>
  isFavorited ? onFavorite() : onDelete(getArt().href))
addListener('favorites:delete', (href) =>
  setTimeout(() => onDelete(href)))
addListener('favorites:loaded', () =>
  win.webContents.send('main:favorites', favorites))

const winConfig = {
  title: 'Favorited Artworks',
  icon: APP_ICON,
  center: true,
  show: false,
  width: 790,
  height: 550,
  resizable: false,
  maximizable: false,
  fullscreenable: false,
  titleBarStyle: 'hidden',
  skipTaskbar: true,
  webPreferences: {
    webAudio: false,
    webgl: false
  }
}

const openFavorites = () => {
  if (win !== undefined) {
    win.focus()
    win.restore()
    return
  }

  win = new BrowserWindow(winConfig)

  win.setMenuBarVisibility(false)
  win.once('ready-to-show', win.show)
  win.on('close', onClose)
  win.loadURL(getUrl('favorites'))

  if (__dev__) win.openDevTools({ mode: 'detach' })
}

const onClose = () => {
  win = undefined
}

const onFavorite = () => {
  const art = getArt()

  favorites.push(art)

  makeThumb(`${art.title} - ${art.text} - ${art.source}`, art.img, (err, d) => {
    if (err) return console.error(err)
    win.webContents.send('main:favorites', favorites)
  })

  cache.write({ favorites }, onWriteConfig)
}

const onWriteConfig = (err, stats) => {
  if (err) console.error(err)
}

const onDelete = (href) => {
  const newFavorites = []
  let found

  for (let item, i = 0, l = favorites.length; i < l; ++i) {
    item = favorites[i]
    if (item.href === href) found = item
    if (item.href !== href) newFavorites.push(item)
  }

  favorites = newFavorites

  if (found) {
    removeThumb(`${found.title} - ${found.text} - ${found.source}`)
    win.webContents.send('main:favorites', favorites)
  }

  cache.write({ favorites }, onWriteConfig)
}

export const isArtFavorited = (href) => {
  for (let i = 0, l = favorites.length; i < l; ++i) {
    if (favorites[i].href === href) return true
  }

  return false
}
