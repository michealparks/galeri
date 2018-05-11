const {app, ipcMain, BrowserWindow} = require('electron')
const wallpaper = require('wallpaper')
const {read, write} = require('../util/app-config')
const {fetchArt, fetchRareArt, initAPIs} = require('./api')
const apis = require('./config')

let artworkData = {}
let lastUpdateTime = -1
let lastPauseTime = -1
let updateTimerId = -1
let isAppReady = false
let isUpdatingArtwork = false
let state = {
  isPaused: false,
  updateRate: 1000 * 60 * 30,
  apis: null,
  isWallpaper: true
}

let screen

const initProvider = (_screen) => read(config => {
  screen = _screen

  if (config) {
    state = config
    initAPIs(config.apis)
  }

  getArtwork()
})

const getArtwork = () => {
  isUpdatingArtwork = true
  lastUpdateTime = Date.now()

  fetchArt(onGetArtwork)

  // if (Math.random() < 0.1) {
  //   fetchRareArt(onGetArtwork)
  // } else {
  //   fetchArt(onGetArtwork)
  // }
}

const onGetArtwork = (artwork) => {
  const {width, height} = screen.getPrimaryDisplay().size

  console.log(width, artwork.width, height, artwork.height)

  if (width - 400 > artwork.width || height - 400 > artwork.height) {
    return getArtwork()
  }

  // The user paused during the artwork fetch
  if (state.isPaused) {
    artworkData = artwork
  }

  // The background hasn't loaded yet
  if (!isAppReady && !state.isWallpaper) {
    ipcMain.once('background:loaded', () => {
      isAppReady = true
      onGetArtwork(artwork)
    })

    return
  }

  if (state.isWallpaper) {
    wallpaper.set(artwork.localsrc).then(() => {
      console.log('done')
    })
  }

  // Send artwork data to all windows
  const windows = BrowserWindow.getAllWindows()
  for (let i = windows.length - 1; i > -1; i -= 1) {
    windows[i].webContents.send('main:artwork', artwork)
  }

  artworkData = null

  // Set a timer for the next artwork fetch
  updateTimerId = setTimeout(getArtwork, state.updateRate)

  isUpdatingArtwork = false
}

// TODO the body may never execute because it's async
app.on('will-quit', () => write({
  isPaused: state.isPaused,
  updateRate: state.updateRate,
  // TODO this is broken: apis
  apis: Object.keys(apis).reduce((obj, key) => {
    obj[key] = {
      artworks: apis[key].artworks,
      pages: apis[key].pages
    }

    return obj
  }, {})
}))

ipcMain.once('background:loaded', () => {
  isAppReady = true
})

ipcMain.on('menubar:update-rate', (e, rate) => {
  console.log('RATE', rate)
  state.updateRate = rate

  if (isUpdatingArtwork) return

  clearTimeout(updateTimerId)

  const timeDif = Date.now() - lastUpdateTime

  updateTimerId = setTimeout(getArtwork, state.updateRate - timeDif)
})

ipcMain.on('menubar:is-paused', (e, isPaused) => {
  state.isPaused = isPaused

  if (isPaused) {
    lastPauseTime = -1
    clearTimeout(updateTimerId)
  } else {
    const timeDif = Date.now() - lastPauseTime

    if (artworkData) {
      updateTimerId = setTimeout(onGetArtwork, state.updateRate - timeDif, artworkData)
    } else {
      updateTimerId = setTimeout(getArtwork, state.updateRate - timeDif)
    }
  }
})

module.exports = initProvider
