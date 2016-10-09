const config = require('application-config')('Galeri Images')
const { getWikiConfig, giveWikiConfig, getWikiImg } = require('./wikipedia')
const { getRijksConfig, giveRijksConfig, getRijksImg } = require('./rijksmuseum')
const { getWaltersMuseumConfig, giveWaltersMuseumConfig, getWaltersMuseumImg } = require('./waltersmuseum')
const CooperHewitt = require('./cooperhewitt')
const BrooklynMuseum = require('./brooklynmuseum')
const MetMuseum = require('./metmuseum')

let srcRotator = 0
let rareSrcRotator = 0
let defaultConfig = {
  wikipedia: {
    timestamp: null,
    results: []
  },
  rijksMuseum: {
    page: null,
    viewedPages: null,
    totalPage: null,
    results: []
  },
  cooperHewitt: {
    page: null,
    viewedPages: null,
    totalPage: null,
    results: []
  },
  waltersMuseum: {
    page: null,
    results: []
  },
  brooklynMuseum: {
    page: null,
    results: []
  },
  metMuseum: {
    page: null,
    results: []
  }
}

window.addEventListener('beforeunload', function () {
  saveConfig()
})

function saveConfig (callback) {
  config.write({
    wikipedia: getWikiConfig(),
    rijksMuseum: getRijksConfig(),
    waltersmuseum: getWaltersMuseumConfig(),
    cooperHewitt: CooperHewitt.getConfig(),
    metMuseum: MetMuseum.getConfig()
  }, callback)
}

// TODO set timeout to update image array
function getNextImage (callback) {
  return MetMuseum.getItemData(callback)

  // This is where we'll put the images we want to rarely display
  if (Math.floor(Math.random() * 30) === 5) {
    switch (rareSrcRotator) {
      case 0: return CooperHewitt.getItemData(callback)
    }
  }

  switch (++srcRotator % 4) {
    case 0: return getWikiImg(callback)
    case 1: return getWaltersMuseumImg(callback)
    case 2: return getRijksImg(callback)
    case 3: return BrooklynMuseum.getItemData(callback)
  }
}

function onReadConfig (err, data) {
  if (err || Object.keys(data).length === 0) {
    data = defaultConfig
  }

  giveWikiConfig(data.wikipedia)
  giveRijksConfig(data.rijksMuseum)
  giveWaltersMuseumConfig(data.waltersMuseum)
  CooperHewitt.giveConfig(data.cooperHewitt)
  BrooklynMuseum.giveConfig(data.brooklynMuseum)
  MetMuseum.giveConfig(data.metMuseum)
}

config.trash(() => {
  config.read(onReadConfig)
})

module.exports = {
  saveConfig,
  getNextImage
}
