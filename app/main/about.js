module.exports = openAbout

const __dev__ = process.env.NODE_ENV === 'development'
const {BrowserWindow} = require('electron')
const {getUrl} = require('./util')

let aboutWin

function openAbout () {
  if (aboutWin !== undefined) {
    aboutWin.focus()
    aboutWin.restore()
    return aboutWin.id
  }

  aboutWin = new BrowserWindow({
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

  aboutWin.once('ready-to-show', aboutWin.show)
  aboutWin.on('close', onClose)
  aboutWin.loadURL(getUrl('about'))

  if (__dev__) aboutWin.openDevTools({ mode: 'detach' })

  return aboutWin.id
}

function onClose () {
  aboutWin = undefined
}
