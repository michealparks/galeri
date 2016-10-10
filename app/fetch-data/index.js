const config = require('application-config')('Galeri Images')
const { getWikiConfig, giveWikiConfig, getWikiImg } = require('./wikipedia')
// const { getRijksConfig, giveRijksConfig, getRijksImg } = require('./rijksmuseum')
const { getWaltersMuseumConfig, giveWaltersMuseumConfig, getWaltersMuseumImg } = require('./waltersmuseum')

const RijksMuseum = require('./rijksmuseum')
const CooperHewitt = require('./cooperhewitt')
const BrooklynMuseum = require('./brooklynmuseum')
const MetMuseum = require('./metmuseum')

let srcRotator = 0
let rareSrcRotator = 0

window.addEventListener('beforeunload', function () {
  saveConfig()
})

function saveConfig (callback) {
  config.write({
    wikipedia: getWikiConfig(),
    rijksMuseum: RijksMuseum.getConfig(),
    waltersmuseum: getWaltersMuseumConfig(),
    cooperHewitt: CooperHewitt.getConfig(),
    metMuseum: MetMuseum.getConfig(),
    brooklynMuseum: BrooklynMuseum.getConfig()
  }, function (err) {
    return err
      ? callback({
        file: 'fetch-data/index.js',
        fn: 'saveConfig()',
        errType: 'error',
        msg: err
      })
      : callback()
  })
}

// TODO set timeout to update image array
function getNextImage (callback) {
  // This is where we'll put the images we want to rarely display,
  // like weird stuff.
  if (Math.floor(Math.random() * 100) === 5) {
    switch (rareSrcRotator) {
      case 0: console.log('cooper'); return CooperHewitt.getNextItem(callback)
    }
  }

  switch (++srcRotator % 6) {
    case 0: console.log('wiki'); return getWikiImg(callback)
    case 2: console.log('walters'); return getWaltersMuseumImg(callback)
    case 3: console.log('rijks'); return RijksMuseum.getNextItem(callback)
    case 4: console.log('brooklyn'); return BrooklynMuseum.getNextItem(callback)
    // we like Met so, so much.
    case 1:
    case 5: console.log('met'); return MetMuseum.getNextItem(callback)
  }
}

function onReadConfig (err, data) {
  if (err) console.warn(err)

  giveWikiConfig(data.wikipedia || {})
  RijksMuseum.giveConfig(data.rijksMuseum)
  giveWaltersMuseumConfig(data.waltersMuseum || {})
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
