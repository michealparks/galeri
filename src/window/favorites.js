import electron, {BrowserWindow} from 'electron'
import {format} from 'url'
import {resolve} from 'path'

let win

function onClose () {
  win = undefined
}

export function sendFavorites (channel, arg) {
  if (win === undefined) return

  win.webContents.send(channel, arg)
}

export function favorites (favoritesArray) {
  if (win !== undefined) {
    win.focus()
    win.restore()
    return
  }

  win = new BrowserWindow({
    title: 'Galeri Favorites',
    center: true,
    show: false,
    width: 790,
    height: 550,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden-inset',
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      webAudio: false,
      webgl: false,
      additionalArguments: [JSON.stringify(favoritesArray)]
    }
  })

  win.setVisibleOnAllWorkspaces(true)
  win.setMenuBarVisibility(false)

  win.once('ready-to-show', win.show)
  win.on('close', onClose)

  if (__dev) win.openDevTools({mode: 'detach'})

  win.loadURL(format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, 'favorites.html')
  }))
}