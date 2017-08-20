module.exports = openAbout

const {BrowserWindow} = require('electron')
const config = require('../../config')
const {getUrl} = require('./util')

let win

function openAbout () {
  if (win !== undefined) {
    win.focus()
    win.restore()
    return win.id
  }

  win = new BrowserWindow({
    title: 'About Galeri',
    icon: config.APP_ICON,
    center: true,
    show: false,
    width: 400,
    height: 300,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden-inset',
    skipTaskbar: true,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  win.setMenuBarVisibility(false)
  win.once('ready-to-show', win.show)
  win.on('close', onClose)
  win.loadURL(getUrl('about'))

  if (__dev__) win.openDevTools({ mode: 'detach' })

  return win.id
}

function onClose () {
  win = undefined
}
