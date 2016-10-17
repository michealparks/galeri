const config = require('application-config')('Galeri Images')
const WaltersMuseum = require('./waltersmuseum')
const Wikipedia = require('./wikipedia')
const RijksMuseum = require('./rijksmuseum')
const CooperHewitt = require('./cooperhewitt')
const BrooklynMuseum = require('./brooklynmuseum')
const MetMuseum = require('./metmuseum')
const { log, warn } = require('../util/log')

let srcRotator = -1
let rareSrcRotator = 0

window.addEventListener('beforeunload', () => saveConfig())

function saveConfig (next) {
  config.write({
    wikipedia: Wikipedia.getConfig(),
    rijksMuseum: RijksMuseum.getConfig(),
    waltersmuseum: WaltersMuseum.getConfig(),
    cooperHewitt: CooperHewitt.getConfig(),
    metMuseum: MetMuseum.getConfig(),
    brooklynMuseum: BrooklynMuseum.getConfig()
  }, err => !err ? next() : next({
    file: 'fetch-data/index.js',
    fn: 'saveConfig()',
    errType: 'error',
    msg: err
  }))
}

// TODO set timeout to update image array
function getNextImage (next) {
  // This is where we'll put the images we want to rarely display,
  // like weird stuff.
  if (Math.floor(Math.random() * 75) === 5) {
    switch (++rareSrcRotator % 2) {
      case 0: log('Cooper'); return CooperHewitt.getNextItem(next)
      case 1: log('Walters'); return WaltersMuseum.getNextItem(next)
    }
  }

  switch (++srcRotator % 6) {
    case 0: log('Wiki'); return Wikipedia.getNextItem(next)
    case 2: log('Walters'); return WaltersMuseum.getNextItem(next)
    case 3: log('Rijks'); return RijksMuseum.getNextItem(next)
    case 4: log('Brooklyn'); return BrooklynMuseum.getNextItem(next)
    // we like Met so, so much.
    // so we give it TWO slots.
    case 1:
    case 5: log('Met'); return MetMuseum.getNextItem(next)
  }
}

config.read(function onReadConfig (err, data) {
  if (err) warn(err)

  Wikipedia.giveConfig(data.wikipedia)
  RijksMuseum.giveConfig(data.rijksMuseum)
  WaltersMuseum.giveConfig(data.waltersMuseum)
  CooperHewitt.giveConfig(data.cooperHewitt)
  BrooklynMuseum.giveConfig(data.brooklynMuseum)
  MetMuseum.giveConfig(data.metMuseum)
})

module.exports = {
  saveConfig,
  getNextImage
}
