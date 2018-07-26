import storage from '../util/storage'
import {metArt, metConfig} from './met'
import {rijksArt, rijksConfig} from './rijks'
import {guggenheimArt, guggenheimConfig} from './guggenheim'
import {wikipediaArt, wikipediaConfig} from './wikipedia'
import {waltersArt, waltersConfig} from './walters'
import {harvardArt, harvardConfig} from './harvard'

const count = 8

export const getNextArtwork = () => {
  if (__dev__) console.log('getNextArtwork()')

  const rare = Math.floor(Math.random() * count * 2) === 0
  return rare ? fetchRare() : fetchArt()
}

const fetchArt = () => {
  const n = Math.floor(Math.random() * count)

  switch (n) {
    case 0: return rijksArt('type=painting')
    case 1: return wikipediaArt('Paintings')
    case 2: return harvardArt('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor')
    case 3: return waltersArt('classification=painting')
    case 4: return metArt('oil on canvas')
    case 5: return metArt('acrylic on canvas')
    case 6: return guggenheimArt('painting')
    case 7: return guggenheimArt('work-on-paper')
  }
}

const fetchRare = () => {
  const n = Math.floor(Math.random() * 3)

  switch (n) {
    case 0: return rijksArt('material=paper&type=drawing&technique=brush')
    case 1: return waltersArt('classification=painting')
    case 2: return metArt('ink and color on paper')
  }
}

export const saveConfig = () => storage('MUSEUMS', {
  version: '0.0.2',
  met_oil: metConfig('oil on canvas'),
  met_acrylic: metConfig('acrylic on canvas'),
  met_ink: metConfig('ink and color on paper'),
  rijks_painting: rijksConfig('type=painting'),
  rijks_drawing: rijksConfig('material=paper&type=drawing&technique=brush'),
  guggenheim_painting: guggenheimConfig('painting'),
  guggenheim_paper: guggenheimConfig('work-on-paper'),
  wikipedia: wikipediaConfig('Paintings'),
  walters: waltersConfig('classification=painting'),
  harvard: harvardConfig('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor')
})

window.addEventListener('beforeunload', saveConfig)
