import {rijksArt} from './rijks'
// import {metArt} from './met'
import {guggenheimArt} from './guggenheim'
import {wikipediaArt} from './wikipedia'
import {waltersArt} from './walters'
import {harvardArt} from './harvard'

const count = 6

export const getNextArtwork = () => {
  if (__dev__) console.log('getNextArtwork()')

  const n = Math.floor(Math.random() * count)

  switch (n) {
    case 0: return rijksArt('type=painting')
    case 1: return wikipediaArt('Paintings')
    case 2: return harvardArt('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor')
    case 3: return waltersArt('classification=painting')
    case 4: return guggenheimArt('painting')
    case 5: return guggenheimArt('work-on-paper')
    // case 6: return metArt('oil on canvas')
    // case 7: return metArt('acrylic on canvas')
  }
}
