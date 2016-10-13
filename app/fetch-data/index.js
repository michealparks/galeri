const config = require('application-config')('Galeri Images')
const WaltersMuseum = require('./waltersmuseum')
const Wikipedia = require('./wikipedia')
const RijksMuseum = require('./rijksmuseum')
const CooperHewitt = require('./cooperhewitt')
const BrooklynMuseum = require('./brooklynmuseum')
const MetMuseum = require('./metmuseum')

let srcRotator = -1
let rareSrcRotator = 0

window.addEventListener('beforeunload', () => saveConfig())

function saveConfig (callback) {
  config.write({
    wikipedia: Wikipedia.getConfig(),
    rijksMuseum: RijksMuseum.getConfig(),
    waltersmuseum: WaltersMuseum.getConfig(),
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
  if (Math.floor(Math.random() * 75) === 5) {
    switch (++rareSrcRotator % 2) {
      case 0: console.log('cooper'); return CooperHewitt.getNextItem(callback)
      case 1: console.log('walters'); return WaltersMuseum.getNextItem(callback)
    }
  }

  switch (++srcRotator % 6) {
    case 0: console.log('wiki'); return Wikipedia.getNextItem(callback)
    case 2: console.log('walters'); return WaltersMuseum.getNextItem(callback)
    case 3: console.log('rijks'); return RijksMuseum.getNextItem(callback)
    case 4: console.log('brooklyn'); return BrooklynMuseum.getNextItem(callback)
    // we like Met so, so much.
    // so we give it TWO slots.
    case 1:
    case 5: console.log('met'); return MetMuseum.getNextItem(callback)
  }
}

function onReadConfig (err, data) {
  if (err) console.warn(err)

  Wikipedia.giveConfig(data.wikipedia)
  RijksMuseum.giveConfig(data.rijksMuseum)
  WaltersMuseum.giveConfig(data.waltersMuseum)
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
