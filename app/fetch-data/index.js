const config = require('application-config')('Galeri Images')
const { getWikiConfig, giveWikiConfig, getWikiImg } = require('./wikipedia')
const { getRijksConfig, giveRijksConfig, getRijksImg } = require('./rijksmuseum')
const { getCooperHewittConfig, giveCooperHewittConfig, getCooperHewittImg } = require('./cooperhewitt')

let srcRotator = 0
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
  }
}

window.addEventListener('beforeunload', function () {
  saveConfig()
})

function saveConfig (callback) {
  config.write({
    wikipedia: getWikiConfig(),
    rijksMuseum: getRijksConfig(),
    cooperHewitt: getCooperHewittConfig()
  }, callback)
}

// TODO set timeout to update image array
function getNextImage (callback) {
  switch (++srcRotator % 3) {
    case 0:
      return getWikiImg(callback)
    case 1:
      return getCooperHewittImg(callback)
    case 2:
      return getRijksImg(callback)
  }
}

function onReadConfig (err, data) {
  if (err || Object.keys(data).length === 0) {
    data = defaultConfig
  }

  giveWikiConfig(data.wikipedia)
  giveRijksConfig(data.rijksMuseum)
  giveCooperHewittConfig(data.cooperHewitt)
}

config.trash(() => {
  config.read(onReadConfig)
})

module.exports = {
  saveConfig,
  getNextImage
}
