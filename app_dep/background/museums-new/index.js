module.exports = {getNextArtwork, saveConfig}

const storage = require('../util/storage')
const Met = require('./met')
const Rijks = require('./rijks')
const Guggenheim = require('./guggenheim')
const Wikipedia = require('./wikipedia')
const Walters = require('./walters')
const Harvard = require('./harvard')
const sourceCount = 6

function getNextArtwork (next) {
  if (Math.floor(Math.random() * sourceCount * 2) === 0) {
    return getNextRareImage(next)
  }

  const n = Math.floor(Math.random() * sourceCount)

  if (__dev__) console.log('getArtwork', n)

  switch (n) {
    case 0: return Met.getNextArtwork('oil on canvas', next)
    case 1: return Met.getNextArtwork('acrylic on canvas', next)
    case 2: return Rijks.getNextArtwork('type=painting', next)
    case 3: return Wikipedia.getNextArtwork('Paintings', next)
    case 4: return Walters.getNextArtwork('classification=painting', next)
    case 5: return Harvard.getNextArtwork('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor', next)
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
  storage('MUSEUMS', {
    version: '0.0.2',
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
