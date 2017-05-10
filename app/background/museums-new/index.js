module.exports = {getNextArtwork, saveConfig}

const {set} = require('../util/storage')
const Met = require('./met')
const Rijks = require('./rijks')
const Guggenheim = require('./guggenheim')
const Wikipedia = require('./wikipedia')

function getNextArtwork (next) {
  if (Math.floor(Math.random() * 6) === 0) {
    return getNextRareImage(next)
  }

  const n = Math.floor(Math.random() * 4)

  if (__dev__) console.log('getArtwork', n)

  switch (n) {
    case 0: return Met.getNextArtwork('oil on canvas', next)
    case 1: return Met.getNextArtwork('acrylic on canvas', next)
    case 2: return Rijks.getNextArtwork('type=painting', next)
    case 3: return Wikipedia.getNextArtwork('Paintings', next)
    default: next(1)
  }
}

function getNextRareImage (next) {
  const n = Math.floor(Math.random() * 4)

  if (__dev__) console.log('getRareArtwork', n)

  switch (n) {
    case 0: return Guggenheim.getNextArtwork('painting', next)
    case 1: return Guggenheim.getNextArtwork('work-on-paper', next)
    case 2: return Met.getNextArtwork('ink and color on paper', next)
    case 3: return Rijks.getNextArtwork('material=paper&type=drawing&technique=brush', next)
    default: next(1)
  }
}

function saveConfig () {
  set('MUSEUMS', {
    version: '0.0.1',
    'met_oil': Met.getConfig('oil on canvas'),
    'met_acrylic': Met.getConfig('acrylic on canvas'),
    'met_ink': Met.getConfig('ink and color on paper'),
    'rijks_painting': Rijks.getConfig('type=painting'),
    'rijks_drawing': Rijks.getConfig('material=paper&type=drawing&technique=brush'),
    'guggenheim_painting': Guggenheim.getConfig('painting'),
    'guggenheim_paper': Guggenheim.getConfig('work-on-paper'),
    'wikipedia': Wikipedia.getConfig('Paintings')
  })
}

window.addEventListener('beforeunload', saveConfig)